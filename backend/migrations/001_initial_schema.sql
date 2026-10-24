-- ============================================================
-- Kairo — Database Schema
-- PostgreSQL 18 on Neon
-- Project: orange-snow-72696664
-- Generated: 2026-10-18
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Enum Types
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TYPE task_status AS ENUM (
    'backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'completed'
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE notification_type AS ENUM (
    'task_assigned', 'task_updated', 'task_completed', 'task_overdue',
    'comment_added', 'mention', 'deadline_approaching', 'system'
);

CREATE TYPE dependency_type AS ENUM ('blocks', 'blocked_by', 'relates_to');

CREATE TYPE recurrence_type AS ENUM (
    'daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'custom'
);

-- ============================================================
-- Core Tables
-- ============================================================

-- Users table
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'user',
    profile_pic     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    timezone        VARCHAR(100) DEFAULT 'UTC',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    color           VARCHAR(7) DEFAULT '#6366f1',
    icon            VARCHAR(50),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project members (many-to-many)
CREATE TABLE project_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Task categories
CREATE TABLE task_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL UNIQUE,
    color           VARCHAR(7) DEFAULT '#8b5cf6',
    icon            VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task tags
CREATE TABLE task_tags (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL UNIQUE,
    color           VARCHAR(7) DEFAULT '#06b6d4',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tasks & Related Tables
-- ============================================================

-- Tasks table (core)
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    url             TEXT,
    image_url       TEXT,
    status          task_status NOT NULL DEFAULT 'todo',
    priority        task_priority NOT NULL DEFAULT 'medium',
    creator_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assignee_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    category_id     UUID REFERENCES task_categories(id) ON DELETE SET NULL,
    parent_task_id  UUID REFERENCES tasks(id) ON DELETE CASCADE,
    start_date      TIMESTAMPTZ,
    due_date        TIMESTAMPTZ,
    estimated_minutes INTEGER,
    actual_minutes  INTEGER,
    completed_at    TIMESTAMPTZ,
    position        INTEGER NOT NULL DEFAULT 0,
    is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task ↔ Tag assignments (many-to-many)
CREATE TABLE task_tag_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id          UUID NOT NULL REFERENCES task_tags(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(task_id, tag_id)
);

-- Subtasks (checklist items within a task)
CREATE TABLE subtasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    is_completed    BOOLEAN NOT NULL DEFAULT FALSE,
    position        INTEGER NOT NULL DEFAULT 0,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Collaboration Tables
-- ============================================================

-- Task comments (threaded)
CREATE TABLE task_comments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content             TEXT NOT NULL,
    parent_comment_id   UUID REFERENCES task_comments(id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task attachments
CREATE TABLE task_attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename        VARCHAR(500) NOT NULL,
    file_url        TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type       VARCHAR(200),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task dependencies
CREATE TABLE task_dependencies (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id  UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type     dependency_type NOT NULL DEFAULT 'blocks',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(task_id, depends_on_task_id),
    CHECK (task_id != depends_on_task_id)
);

-- Task activity / audit log
CREATE TABLE task_activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    field_name      VARCHAR(100),
    old_value       TEXT,
    new_value       TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Automation & Productivity Tables
-- ============================================================

-- Notifications
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           VARCHAR(500) NOT NULL,
    message         TEXT,
    task_id         UUID REFERENCES tasks(id) ON DELETE CASCADE,
    actor_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recurring task rules
CREATE TABLE recurring_task_rules (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    recurrence_type     recurrence_type NOT NULL,
    interval_value      INTEGER NOT NULL DEFAULT 1,
    days_of_week        INTEGER[] DEFAULT '{}',
    day_of_month        INTEGER,
    end_date            TIMESTAMPTZ,
    max_occurrences     INTEGER,
    occurrences_count   INTEGER NOT NULL DEFAULT 0,
    next_run_at         TIMESTAMPTZ,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Time tracking entries
CREATE TABLE time_entries (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description         TEXT,
    started_at          TIMESTAMPTZ NOT NULL,
    ended_at            TIMESTAMPTZ,
    duration_minutes    INTEGER,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Focus / Pomodoro sessions
CREATE TABLE focus_sessions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
    duration_minutes    INTEGER NOT NULL DEFAULT 25,
    break_minutes       INTEGER NOT NULL DEFAULT 5,
    started_at          TIMESTAMPTZ NOT NULL,
    ended_at            TIMESTAMPTZ,
    is_completed        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Settings & AI Tables
-- ============================================================

-- User preferences
CREATE TABLE user_preferences (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    theme                   VARCHAR(20) NOT NULL DEFAULT 'light',
    notifications_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications     BOOLEAN NOT NULL DEFAULT FALSE,
    daily_summary           BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_summary          BOOLEAN NOT NULL DEFAULT TRUE,
    default_task_view       VARCHAR(50) NOT NULL DEFAULT 'list',
    pomodoro_duration       INTEGER NOT NULL DEFAULT 25,
    break_duration          INTEGER NOT NULL DEFAULT 5,
    working_hours_start     TIME DEFAULT '09:00',
    working_hours_end       TIME DEFAULT '17:00',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI interaction logs
CREATE TABLE ai_interactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt              TEXT NOT NULL,
    response            TEXT,
    model               VARCHAR(100),
    tokens_used         INTEGER,
    task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
    interaction_type    VARCHAR(50) NOT NULL DEFAULT 'chat',
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    device_info     TEXT,
    is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_tasks_creator       ON tasks(creator_id);
CREATE INDEX idx_tasks_assignee      ON tasks(assignee_id);
CREATE INDEX idx_tasks_status        ON tasks(status);
CREATE INDEX idx_tasks_priority      ON tasks(priority);
CREATE INDEX idx_tasks_due_date      ON tasks(due_date);
CREATE INDEX idx_tasks_project       ON tasks(project_id);
CREATE INDEX idx_tasks_parent        ON tasks(parent_task_id);
CREATE INDEX idx_tasks_created       ON tasks(created_at DESC);

CREATE INDEX idx_task_comments_task  ON task_comments(task_id);
CREATE INDEX idx_task_activity_task  ON task_activity_logs(task_id);
CREATE INDEX idx_task_activity_created ON task_activity_logs(created_at DESC);

CREATE INDEX idx_notifications_user  ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

CREATE INDEX idx_time_entries_task   ON time_entries(task_id);
CREATE INDEX idx_time_entries_user   ON time_entries(user_id);
CREATE INDEX idx_focus_sessions_user ON focus_sessions(user_id);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_users_email         ON users(email);
CREATE INDEX idx_subtasks_task       ON subtasks(task_id);

-- ============================================================
-- Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users      BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_tasks      BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_projects   BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_subtasks   BEFORE UPDATE ON subtasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_comments   BEFORE UPDATE ON task_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_recurring  BEFORE UPDATE ON recurring_task_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_preferences BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
