"""
Guardrails for the chat assistants, applied around the agent loop.

- check_input: refuses requests for system internals (database structure, SQL, source code,
  infrastructure, secrets, the system prompt) and prompt-injection / jailbreak attempts,
  before anything reaches the model.
- sanitize_output: redacts secrets that slip into a reply and withholds replies that leak
  internals, in case the model is talked around anyway.
- RateLimiter: caps assistant turns per user so the chat cannot be used to hammer the API.

These apply to admins too: an admin manages the organisation's work through the assistant,
not the platform's internals.
"""
import re
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional, Tuple

MAX_USER_MESSAGE_CHARS = 2000
RATE_LIMIT_TURNS = 20
RATE_LIMIT_WINDOW_SECONDS = 60

REFUSALS = {
    "internals": (
        "I can't share details about how Kairo is built: database structure, tables, columns, SQL, "
        "source code or infrastructure are off-limits in this chat. I can help with tasks, projects, "
        "comments and users instead. (If that was a task title, put it in quotes.)"
    ),
    "secrets": (
        "I can't help with passwords, password hashes, tokens, API keys or other credentials. "
        "To reset a password, use the account settings or the admin panel."
    ),
    "prompt": "I can't share my instructions or configuration, but I'm happy to help with your tasks and projects.",
    "injection": (
        "I can't change how I operate or bypass my rules. Tell me what you'd like to do with your "
        "tasks, projects or team and I'll help."
    ),
    "too_long": f"That message is too long. Please keep requests under {MAX_USER_MESSAGE_CHARS} characters.",
    "rate_limited": "You're sending requests too quickly. Please wait a moment and try again.",
    "output": "I can't share that information. Ask me about tasks, projects, comments or users instead.",
}

_I = re.IGNORECASE

# (category, pattern) pairs; the first match decides the refusal shown to the user
INPUT_RULES = [
    ("injection", re.compile(
        r"\b(ignore|disregard|forget|override|bypass)\b.{0,40}\b(previous|prior|above|earlier|all|your|system)\b"
        r".{0,20}\b(instructions?|rules?|prompts?|guidelines?|guardrails?|restrictions?)\b", _I)),
    ("injection", re.compile(
        r"\b(jailbreak|DAN mode|developer mode|god mode|sudo mode|unrestricted mode|no restrictions)\b", _I)),
    ("injection", re.compile(
        r"\b(you are now|from now on you are|pretend (to be|you are)|act as|roleplay as)\b"
        r".{0,60}\b(unrestricted|unfiltered|without (any )?(rules|restrictions|limits)|dba|database admin\w*|"
        r"system|root|developer)\b", _I)),
    ("injection", re.compile(r"<\s*/?\s*(system|assistant|tool)\s*>|\[\s*(system|INST)\s*\]", _I)),
    ("prompt", re.compile(
        r"\b(system|initial|hidden|original|developer)\s+(prompt|instructions?|message)\b", _I)),
    ("prompt", re.compile(
        r"\b(show|reveal|print|repeat|tell|give|list|dump|output|what (are|is))\b.{0,30}\b(your|the)\b.{0,20}"
        r"\b(instructions|rules|prompt|configuration|tools|functions)\b", _I)),
    ("secrets", re.compile(
        r"\b(password[\s_-]?hash\w*|token[\s_-]?hash\w*|hashed passwords?|api[\s_-]?keys?|secret[\s_-]?keys?|"
        r"jwt[\s_-]?secret|access[\s_-]?tokens?|refresh[\s_-]?tokens?|env(ironment)?\s+var\w*|\.env\b|"
        r"credentials?|connection\s+string|database[\s_]url|groq[\s_]api)\b", _I)),
    ("secrets", re.compile(
        r"\b(what('?s| is)|show|tell|give|reveal|list|get|find)\b.{0,40}\bpasswords?\b", _I)),
    ("internals", re.compile(
        r"\b(database|db|data\s*base)\s+(structure|schema|design|layout|tables?|columns?|model|diagram|"
        r"internals?|dump|backup|engine|version|server|host)\b", _I)),
    ("internals", re.compile(
        r"\b(schemas?|tables?|columns?|fields?)\b.{0,30}\b(in|of|from|inside)\b.{0,15}\b(the\s+)?(database|db|postgres\w*)\b",
        _I)),
    ("internals", re.compile(
        r"\b(dump|export|backup|back up|copy|download|clone|wipe|drop)\b.{0,20}\b(database|db)\b|"
        r"\bhow\b.{0,20}\b(data|records?|information)\b.{0,10}\b(stored|structured|organi[sz]ed|saved)\b", _I)),
    ("internals", re.compile(
        r"\b(which|what|list|show|describe|name)\b.{0,25}\b(tables|columns|schemas|indexes|foreign keys|"
        r"primary keys|migrations)\b", _I)),
    ("internals", re.compile(
        r"\b(sql|postgres\w*|psql|sqlalchemy|information_schema|pg_catalog|ERD|DDL)\b", _I)),
    ("internals", re.compile(
        r"\b(select\s+.+\s+from|insert\s+into|update\s+\w+\s+set|delete\s+from|drop\s+(table|database)|"
        r"truncate\s+\w+|alter\s+table|create\s+table|union\s+select)\b", _I)),
    ("internals", re.compile(
        r"\b(your|kairo'?s?|this (app|platform|system|site)'?s?|the (app|platform|system)'?s?)\s+"
        r"(source\s+code|code|codebase|backend|api|endpoints?|server|infrastructure|(tech\s+)?stack|"
        r"architecture|config\w*|model|llm)\b", _I)),
    ("internals", re.compile(r"\b(which|what)\s+(llm|ai model|language model|model are you)\b", _I)),
]

# Quoted text ("Fix SQL migration") is usually a task title or comment, so internals rules skip it
QUOTED = re.compile(r"\"[^\"]*\"|“[^”]*”|'[^']{3,}'")

SECRET_PATTERNS = [
    re.compile(r"\bgsk_[A-Za-z0-9]{20,}\b"),                               # Groq keys
    re.compile(r"\b(sk|pk|rk)[-_][A-Za-z0-9_-]{20,}\b"),                     # generic provider keys
    re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b"),  # JWTs
    re.compile(r"\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}"),                       # bcrypt hashes
    re.compile(r"\b(postgres(ql)?|mysql|redis|mongodb(\+srv)?)://\S+", _I),  # connection strings
]

OUTPUT_LEAK_PATTERNS = [
    re.compile(r"\b(password_hash|token_hash|information_schema|pg_catalog|alembic_version)\b", _I),
    re.compile(r"\b(create|alter|drop)\s+table\b", _I),
    re.compile(r"\bSELECT\s+[\w\s,.*()]+\s+FROM\s+\w+"),
    re.compile(r"\b(GROQ_API_KEY|JWT_SECRET\w*|DATABASE_URL|SECRET_KEY)\b"),
]


def check_input(message: str) -> Optional[Tuple[str, str]]:
    """Return (category, refusal) when the message must not reach the model, else None."""
    if len(message) > MAX_USER_MESSAGE_CHARS:
        return "too_long", REFUSALS["too_long"]
    normalized = re.sub(r"\s+", " ", message)
    unquoted = QUOTED.sub('""', normalized)
    for category, pattern in INPUT_RULES:
        if pattern.search(unquoted if category == "internals" else normalized):
            return category, REFUSALS[category]
    return None


def sanitize_output(reply: str) -> Tuple[str, bool]:
    """Redact secrets and withhold internal details. Returns (safe_reply, was_modified)."""
    if any(p.search(reply) for p in OUTPUT_LEAK_PATTERNS):
        return REFUSALS["output"], True
    safe = reply
    for pattern in SECRET_PATTERNS:
        safe = pattern.sub("[redacted]", safe)
    return safe, safe != reply


class RateLimiter:
    """Sliding-window limit per user. In-process, so each server instance keeps its own window."""

    def __init__(self, limit: int = RATE_LIMIT_TURNS, window: float = RATE_LIMIT_WINDOW_SECONDS):
        self.limit = limit
        self.window = window
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        hits = self._hits[key]
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if len(hits) >= self.limit:
            return False
        hits.append(now)
        return True


rate_limiter = RateLimiter()
