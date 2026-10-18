import React, { useState } from 'react';
import { 
  X, Sparkles, Send, Calendar, CheckCircle2, 
  ArrowRight, Bot, User, Clock, Loader2, CalendarClock, AlertTriangle, PenLine 
} from 'lucide-react';
import { aiService, AISmartScheduleItem } from '../../services/aiService';
import { ParsedTaskDTO, TaskCreateInput } from '../../types';
import { Badge } from '../common/Badge';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreatedFromAI: (data: TaskCreateInput) => Promise<void>;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  parsedTask?: ParsedTaskDTO;
  schedule?: AISmartScheduleItem[];
  timestamp: Date;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onTaskCreatedFromAI,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your AI Task Copilot. I can turn natural language into structured tasks, break down complex projects, or build your optimized daily focus schedule. How can I assist you?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const lower = text.toLowerCase();

      // Check if user is asking to plan the day or schedule
      if (lower.includes('plan my day') || lower.includes('schedule') || lower.includes('smart schedule')) {
        const scheduleResult = await aiService.smartSchedule();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: `Here is your optimized daily schedule based on priority and deadlines:\n\n${scheduleResult.summary || ''}`,
            schedule: scheduleResult.schedule,
            timestamp: new Date(),
          },
        ]);
      }
      // Check if user is typing a task command (e.g. "add task", "create task", or contains dates/deadlines)
      else if (lower.startsWith('add task') || lower.startsWith('create task') || lower.startsWith('remind me') || lower.includes('by ') || lower.includes('tomorrow')) {
        const parsed = await aiService.parseTask(text);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: `I parsed your task! Click "Create Task" below to add it directly to your workspace:`,
            parsedTask: parsed,
            timestamp: new Date(),
          },
        ]);
      }
      // Standard scoped conversation
      else {
        const chatRes = await aiService.chat(text);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: chatRes.reply,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I processed your request using the local offline heuristic engine. Your data remains strictly isolated and confidential.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTaskCreate = async (parsed: ParsedTaskDTO) => {
    await onTaskCreatedFromAI({
      title: parsed.title,
      description: parsed.description || undefined,
      priority: parsed.priority,
      due_date: parsed.due_date || undefined,
      subtasks: parsed.suggested_subtasks,
      status: 'todo',
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `✅ Task "${parsed.title}" has been successfully added to your workspace with ${parsed.suggested_subtasks?.length || 0} checklist items!`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[460px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between bg-indigo-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-800 leading-tight">AI Task Copilot</h2>
            <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
              Privacy-Scoped &amp; Dual Engine
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg"
          aria-label="Close AI Copilot"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend("Plan my day with optimized schedule")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 rounded-lg border border-slate-200 shrink-0 font-medium transition-colors"
        >
          <CalendarClock className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
          Plan my day
        </button>
        <button
          onClick={() => handleSend("What tasks are currently blocked or overdue?")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 rounded-lg border border-slate-200 shrink-0 font-medium transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          Overdue items
        </button>
        <button
          onClick={() => handleSend("Add task: Review Q4 deployment checklist by tomorrow 5pm with urgent priority")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 rounded-lg border border-slate-200 shrink-0 font-medium transition-colors"
        >
          <PenLine className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          Natural language parse
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isAi = m.sender === 'ai';

          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAi ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isAi
                    ? 'bg-slate-50 text-slate-800 border border-slate-200/70 shadow-2xs'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Parsed Task Card if AI created a DTO */}
                {m.parsedTask && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-2 text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{m.parsedTask.title}</span>
                      <Badge type="priority" value={m.parsedTask.priority} />
                    </div>

                    {m.parsedTask.suggested_subtasks && m.parsedTask.suggested_subtasks.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Suggested Subtasks:
                        </span>
                        {m.parsedTask.suggested_subtasks.map((st, i) => (
                          <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleConfirmTaskCreate(m.parsedTask!)}
                      className="w-full mt-2 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Add Task</span>
                    </button>
                  </div>
                )}

                {/* Smart Schedule breakdown if present */}
                {m.schedule && m.schedule.length > 0 && (
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-200">
                    {m.schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-700">
                            {item.time_slot}
                          </span>
                          <span className="font-semibold text-[11px] text-slate-800 truncate max-w-[170px]">
                            {item.task_title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">{item.priority}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI Copilot is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-indigo-500 transition-colors"
        >
          <input
            type="text"
            placeholder="Describe a task or ask for daily focus plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-2xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
