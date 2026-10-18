export type UserRole = 'admin' | 'user';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_pic?: string | null;
  is_active: boolean;
  timezone?: string;
  created_at?: string;
}

export interface UserPreferences {
  theme: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  daily_summary: boolean;
  weekly_summary: boolean;
  default_task_view: 'list' | 'kanban' | 'calendar';
  pomodoro_duration: number;
  break_duration: number;
  working_hours_start: string;
  working_hours_end: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  completed_at?: string | null;
  created_at?: string;
}

export interface TaskTag {
  id: string;
  name: string;
  color: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string | null;
  created_at: string;
  user?: User;
}

export interface TaskActivityLog {
  id: string;
  task_id: string;
  user_id?: string | null;
  action: string;
  field_name?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  metadata?: any;
  created_at: string;
  user?: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
  image_url?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  creator_id: string;
  assignee_id?: string | null;
  project_id?: string | null;
  category_id?: string | null;
  due_date?: string | null;
  estimated_minutes?: number | null;
  actual_minutes?: number | null;
  completed_at?: string | null;
  position: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  assignee?: User | null;
  creator?: User | null;
  subtasks?: Subtask[];
  tags?: TaskTag[];
}

export type TaskCreateInput = Omit<Partial<Task>, 'subtasks'> & {
  subtasks?: string[];
  tag_ids?: string[];
};

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  color?: string;
  icon?: string | null;
  owner_id: string;
  is_archived: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string | null;
  task_id?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface UserAnalytics {
  total_assigned: number;
  completed_tasks: number;
  in_progress_tasks: number;
  blocked_tasks: number;
  overdue_tasks: number;
  completion_rate_pct: number;
  total_focus_minutes: number;
  active_streak_days: number;
}

export interface AdminAnalytics {
  organization_total_tasks: number;
  active_users_count: number;
  org_completed_tasks: number;
  org_completion_rate: number;
  overdue_total: number;
  workload_distribution: Array<{
    user_id: string;
    name: string;
    task_count: number;
    completed_count: number;
  }>;
}

export interface ParsedTaskDTO {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  due_date?: string | null;
  suggested_subtasks?: string[];
  tags?: string[];
}
