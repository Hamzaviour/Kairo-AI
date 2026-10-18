"""Vercel serverless entrypoint: exposes the FastAPI backend as one Python function.

vercel.json rewrites every /api/* request here; FastAPI still sees the original path.
"""
import os
import sys

BACKEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.main import app  # noqa: E402,F401
