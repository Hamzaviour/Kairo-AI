import os
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

def _normalize_db_url(url: str) -> str:
    """Pin the psycopg 3 driver; Vercel/Neon integrations hand out postgres:// URLs."""
    for prefix in ("postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg://" + url[len(prefix):]
    return url

# Engine configuration for PostgreSQL (Neon)
if os.environ.get("VERCEL"):
    # Serverless instances freeze between requests; let Neon's pooler own the connections
    engine = create_engine(_normalize_db_url(settings.DATABASE_URL), poolclass=NullPool)
else:
    engine = create_engine(
        _normalize_db_url(settings.DATABASE_URL),
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,  # Automatically detects disconnected pool connections and reconnects
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
