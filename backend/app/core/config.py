import os
from typing import List
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Public development default; a deployment must override it or anyone could mint tokens
DEV_JWT_SECRET = "hccdi-task-manager-super-secure-jwt-secret-key-2026-production-grade"


class Settings(BaseSettings):
    APP_NAME: str = "HCCDI Task Manager"
    APP_VERSION: str = "1.0.0"
    # Deployed on Vercel unless told otherwise, so error responses never echo exception details
    ENVIRONMENT: str = "production" if os.environ.get("VERCEL") else "development"
    LOG_LEVEL: str = "INFO"
    
    # Database
    # Vercel's Neon / Postgres integrations inject POSTGRES_URL; DATABASE_URL wins when both are set
    DATABASE_URL: str = Field(validation_alias=AliasChoices("DATABASE_URL", "POSTGRES_URL"))
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Security / JWT
    JWT_SECRET_KEY: str = DEV_JWT_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    
    # AI Integration
    AI_PROVIDER: str = "heuristic_and_llm"
    AI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o-mini"
    AI_BASE_URL: str = ""

    # Groq-hosted LLM behind the floating chat assistants (user + admin)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    # Used when the primary model hits Groq's per-minute token limit
    GROQ_FALLBACK_MODEL: str = "openai/gpt-oss-20b"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

if os.environ.get("VERCEL") and settings.JWT_SECRET_KEY == DEV_JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET_KEY is not set. Add a long random value in Vercel → Project Settings → "
        "Environment Variables (e.g. `openssl rand -hex 32`) and redeploy."
    )
