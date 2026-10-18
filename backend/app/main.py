import logging
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.core.config import settings
from app.core.database import SessionLocal
from app.api.api import api_router
from app.core.demo_seed import bootstrap_if_empty

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # A fresh deployment (e.g. a new Neon database on Vercel) gets its schema and demo data here
    try:
        bootstrap_if_empty()
    except Exception:
        logger.exception("Database bootstrap failed; /api/health will report the database state")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise AI-Powered Task Management & To-Do Platform API with Multi-Tenant Data Isolation and Dual-Engine AI.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.detail,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "detail": exc.detail
            },
            "meta": {"timestamp": datetime.now(timezone.utc).isoformat()}
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "data": None,
            "message": "Internal server error occurred",
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "detail": str(exc) if settings.ENVIRONMENT == "development" else "An unexpected error occurred"
            },
            "meta": {"timestamp": datetime.now(timezone.utc).isoformat()}
        }
    )

# Healthcheck Endpoint
@app.get("/api/health", tags=["Health & System"])
def health_check():
    """Verify backend and live database connectivity."""
    start = time.time()
    db_status = "unhealthy"
    latency_ms = 0.0

    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
        latency_ms = round((time.time() - start) * 1000, 2)
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "engine": "PostgreSQL 18 on Neon",
            "status": db_status,
            "latency_ms": latency_ms
        },
        "ai_engine": {
            "mode": settings.AI_PROVIDER,
            "fallback_active": True
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Register all domain routers
app.include_router(api_router, prefix="/api")
