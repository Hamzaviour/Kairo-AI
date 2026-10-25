"""Vercel serverless entrypoint: exposes the FastAPI backend as one Python function.

vercel.json rewrites every /api/* request here; FastAPI still sees the original path.

If the backend cannot start (usually a missing environment variable), a small fallback app
answers instead, so the API returns a readable 503 rather than an opaque FUNCTION_INVOCATION_FAILED.
"""
import logging
import os
import sys

BACKEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


def _load_app():
    try:
        from app.main import app as backend
        return backend
    except Exception as exc:  # noqa: BLE001
        logging.getLogger("kairo").exception("Backend failed to start")
        from fastapi import FastAPI
        from fastapi.responses import JSONResponse

        # Only the exception type and the names of missing settings are shown, never their values
        missing = []
        if hasattr(exc, "errors"):
            missing = [".".join(str(p) for p in e.get("loc", ())) for e in exc.errors() if e.get("type") == "missing"]
        reason = (
            f"Missing environment variables: {', '.join(missing)}" if missing
            else str(exc) if isinstance(exc, RuntimeError) else type(exc).__name__
        )

        fallback = FastAPI()

        @fallback.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
        def backend_unavailable(path: str):
            return JSONResponse(
                status_code=503,
                content={"success": False, "data": None, "message": "Backend is not configured",
                         "error": {"code": "BACKEND_UNAVAILABLE", "detail": reason}},
            )

        return fallback


# Vercel's Python runtime looks for a top-level ASGI variable named `app`
app = _load_app()
