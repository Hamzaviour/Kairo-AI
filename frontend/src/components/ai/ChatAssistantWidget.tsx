import React, { useEffect, useRef, useState } from 'react';
import { Bot, ShieldCheck, Send, X, Loader2, RotateCcw, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { assistantService, AssistantAction, AssistantMessage } from '../../services/assistantService';
import { useAuth } from '../../context/AuthContext';

interface ChatAssistantWidgetProps {
  // Called after the assistant wrote to the database, so the workspace can refetch
  onDataChanged: () => void;
}

interface ChatEntry extends AssistantMessage {
  actions?: AssistantAction[];
  error?: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  list_tasks: 'Searched tasks',
  get_task: 'Read task',
  create_task: 'Created task',
  update_task: 'Updated task',
  delete_task: 'Deleted task',
  duplicate_task: 'Duplicated task',
  add_subtask: 'Added subtask',
  update_subtask: 'Updated subtask',
  delete_subtask: 'Deleted subtask',
  add_comment: 'Added comment',
  delete_comment: 'Deleted comment',
  list_projects: 'Read projects',
  create_project: 'Created project',
  update_project: 'Updated project',
  delete_project: 'Archived project',
  add_project_member: 'Added member',
  remove_project_member: 'Removed member',
  task_summary: 'Counted tasks',
  list_users: 'Read users',
  create_user: 'Created user',
  update_user: 'Updated user',
  delete_user: 'Deleted user',
  list_tables: 'Read schema',
  sql_query: 'Ran SQL query',
  sql_execute: 'Ran SQL write',
};

const PERSONAS = {
  user: {
    title: 'Kairo Assistant',
    subtitle: 'Your tasks & projects',
    greeting:
      "Hi! I can create, find, update and delete your tasks, subtasks, comments and projects. Just tell me what you need.",
    suggestions: [
      'What should I work on today?',
      'Create a high priority task "Prepare demo" due Friday 5pm',
      'Show my overdue tasks',
      'Mark my in-progress tasks as in review',
    ],
    placeholder: 'Ask or tell me what to change…',
  },
  admin: {
    title: 'Admin Assistant',
    subtitle: 'Full database access',
    greeting:
      'Hello, admin. I have organization-wide access: every task, project, comment and user account, plus direct SQL on the database. Deletes and SQL writes always wait for your confirmation.',
    suggestions: [
      'How many tasks does each user have, by status?',
      'List all users and their roles',
      'Show every overdue task across the organization',
      'Which tables are in the database?',
    ],
    placeholder: 'Query, create, update or delete anything…',
  },
} as const;

// Minimal Markdown: headings, bullet/numbered lists, tables, **bold**, `code`
const renderInline = (text: string, keyPrefix: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`${keyPrefix}-${i}`} className="px-1 py-0.5 rounded bg-slate-200/70 font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });

const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (line.trim().startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={`t${i}`} className="overflow-x-auto my-1.5">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr>{head.map((c, j) => <th key={j} className="text-left font-semibold px-2 py-1 border-b border-slate-300">{renderInline(c, `h${i}${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, k) => (
                <tr key={k}>{r.map((c, j) => <td key={j} className="px-2 py-1 border-b border-slate-200">{renderInline(c, `c${i}${k}${j}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push(
        <ul key={`l${i}`} className="my-1 space-y-0.5 pl-4 list-disc marker:text-slate-400">
          {items.map((it, j) => <li key={j}>{renderInline(it, `li${i}${j}`)}</li>)}
        </ul>
      );
      continue;
    }

    const heading = line.match(/^#{1,4}\s+(.*)$/);
    if (heading) {
      blocks.push(<p key={`h${i}`} className="font-semibold mt-1.5">{renderInline(heading[1], `hd${i}`)}</p>);
    } else if (line.trim()) {
      blocks.push(<p key={`p${i}`}>{renderInline(line, `p${i}`)}</p>);
    } else if (blocks.length) {
      blocks.push(<div key={`s${i}`} className="h-1.5" />);
    }
    i++;
  }

  return <div className="space-y-0.5 break-words">{blocks}</div>;
};

const storageKey = (userId: string, mode: string) => `kairo-assistant:${mode}:${userId}`;

export const ChatAssistantWidget: React.FC<ChatAssistantWidgetProps> = ({ onDataChanged }) => {
  const { user, isAdmin } = useAuth();
  const mode = isAdmin ? 'admin' : 'user';
  const persona = PERSONAS[mode];

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore this user's conversation for the tab session; storage can be unavailable
  useEffect(() => {
    if (!user) return;
    try {
      const saved = sessionStorage.getItem(storageKey(user.id, mode));
      setMessages(saved ? JSON.parse(saved) : []);
    } catch {
      setMessages([]);
    }
  }, [user?.id, mode]);

  useEffect(() => {
    if (!user) return;
    try {
      sessionStorage.setItem(storageKey(user.id, mode), JSON.stringify(messages.slice(-40)));
    } catch {
      // Conversation simply won't survive a reload
    }
  }, [messages, user?.id, mode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!user) return null;

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    const next: ChatEntry[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setIsLoading(true);

    try {
      // Only real turns go to the model; failed replies are UI-only
      const history = next.filter((m) => !m.error).map(({ role, content: c }) => ({ role, content: c })).slice(-20);
      const res = await assistantService.chat(history, isAdmin);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply || 'Done.', actions: res.actions }]);
      if (res.data_changed) onDataChanged();
    } catch (err: any) {
      const detail = err?.response?.data?.message || 'The assistant is unavailable right now. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: detail, error: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Both personas live on ink; the admin one is marked by the saffron launcher and badge
  const accent = isAdmin
    ? { launcher: 'bg-brand-400 hover:bg-brand-300 text-slate-950', header: 'bg-slate-950 text-white', bubble: 'bg-slate-900 text-white', ring: 'focus-within:border-slate-900', send: 'bg-slate-900 hover:bg-slate-800', tile: 'bg-brand-400 text-slate-950' }
    : { launcher: 'bg-slate-900 hover:bg-slate-800 text-white', header: 'bg-slate-950 text-white', bubble: 'bg-slate-900 text-white', ring: 'focus-within:border-slate-900', send: 'bg-slate-900 hover:bg-slate-800', tile: 'bg-white/10 text-brand-400' };
  const PersonaIcon = isAdmin ? ShieldCheck : Bot;

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-label={persona.title}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          className="fixed z-30 bottom-20 right-4 left-4 sm:left-auto sm:w-[400px] h-[min(600px,calc(100vh-7rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in"
        >
          <div className={`px-4 py-3 flex items-center justify-between ${accent.header}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent.tile}`}>
                <PersonaIcon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-[15px] leading-tight">{persona.title}</h2>
                <span className="text-[11px] text-slate-400">{persona.subtitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([])}
                disabled={isLoading || messages.length === 0}
                className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-40"
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/15" aria-label="Close assistant">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            <div className="flex gap-2 items-start">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${accent.bubble}`}>
                <PersonaIcon className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-md p-3 text-xs leading-relaxed bg-white text-slate-800 border border-slate-200">
                {persona.greeting}
              </div>
            </div>

            {messages.length === 0 && (
              <div className="pl-9 flex flex-col items-start gap-1.5">
                {persona.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, idx) =>
              m.role === 'user' ? (
                <div key={idx} className="flex justify-end">
                  <div className={`max-w-[85%] rounded-2xl rounded-tr-md px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${accent.bubble}`}>
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex gap-2 items-start">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.error ? 'bg-rose-100 text-rose-600' : accent.bubble}`}>
                    {m.error ? <AlertCircle className="w-3.5 h-3.5" /> : <PersonaIcon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="max-w-[85%] space-y-1.5">
                    <div
                      className={`rounded-2xl rounded-tl-md p-3 text-xs leading-relaxed border ${
                        m.error ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-white text-slate-800 border-slate-200'
                      }`}
                    >
                      <MarkdownText text={m.content} />
                    </div>
                    {m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {m.actions.map((a, j) => (
                          <span
                            key={j}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                              !a.ok
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : a.write
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {a.ok ? <Check className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                            {TOOL_LABELS[a.tool] || a.tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {isLoading && (
              <div className="flex items-center gap-2 pl-9 text-[11px] text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Working on it…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 border-t border-slate-200 bg-white"
          >
            <div className={`flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-white transition-colors ${accent.ring}`}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                placeholder={persona.placeholder}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-1 resize-none max-h-28 text-xs bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-1.5 text-white rounded-lg disabled:opacity-40 transition-colors ${accent.send}`}
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed z-30 bottom-5 right-5 w-14 h-14 rounded-2xl shadow-float flex items-center justify-center transition-[transform,background-color] duration-200 hover:-translate-y-0.5 ${accent.launcher}`}
        aria-label={isOpen ? 'Close assistant' : `Open ${persona.title}`}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : isAdmin ? <ShieldCheck className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </>
  );
};
