"""
Create the schema (if missing) and the demo data in the database at DATABASE_URL.

The API does this by itself on first start against an empty database; run this to
restore demo rows later. Idempotent.

Usage (from the repository root):
    DATABASE_URL=postgresql://... python scripts/seed_demo.py
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

if __name__ == "__main__":
    if not os.environ.get("DATABASE_URL") and not os.environ.get("POSTGRES_URL"):
        sys.exit("DATABASE_URL is not set")
    from app.core.demo_seed import seed

    seed()
