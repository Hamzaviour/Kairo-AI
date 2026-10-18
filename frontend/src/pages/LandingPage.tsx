import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, CheckSquare, Kanban, Calendar, BarChart3, FolderKanban,
  Sparkles, FileSpreadsheet, ArrowRight, Play, Lock, ShieldCheck, KeyRound,
  FlaskConical, Github, Upload, ScanSearch, Download, CornerDownLeft,
} from 'lucide-react';

const REPO_URL = 'https://github.com/Hamzaviour/AI-Based-To-Do-App';

type Viewer = 'admin' | 'user';
type Status = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'completed';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Mirrors scripts/seed_demo.py, the same data the live demo opens with
const DEMO_TASKS: { title: string; status: Status; priority: Priority; owner: 'Alexander Wright' | 'Sarah Jenkins'; due: string }[] = [
  { title: 'Prepare Q4 budget report', status: 'todo', priority: 'urgent', owner: 'Alexander Wright', due: 'Oct 21' },
  { title: 'Weekly sprint retro notes', status: 'todo', priority: 'medium', owner: 'Sarah Jenkins', due: 'Oct 19' },
  { title: 'Migrate legacy spreadsheet tracker', status: 'in_review', priority: 'high', owner: 'Alexander Wright', due: 'Oct 23' },
  { title: 'Fix flaky login redirect', status: 'blocked', priority: 'high', owner: 'Sarah Jenkins', due: 'Oct 20' },
  { title: 'Implement User Authentication', status: 'in_progress', priority: 'high', owner: 'Alexander Wright', due: 'Oct 22' },
  { title: 'Design Kanban empty states', status: 'in_progress', priority: 'medium', owner: 'Sarah Jenkins', due: 'Oct 24' },
  { title: 'Setup CI/CD Pipeline', status: 'todo', priority: 'urgent', owner: 'Alexander Wright', due: 'Oct 28' },
  { title: 'Design Database Schema', status: 'completed', priority: 'medium', owner: 'Sarah Jenkins', due: 'Oct 25' },
  { title: 'Write onboarding guide', status: 'backlog', priority: 'low', owner: 'Alexander Wright', due: 'Nov 1' },
];

const STATUS_LABEL: Record<Status, string> = {
  backlog: 'Backlog', todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', blocked: 'Blocked', completed: 'Completed',
};
const STATUS_STYLE: Record<Status, string> = {
  backlog: 'bg-slate-100 text-slate-600',
  todo: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-50 text-blue-700',
  in_review: 'bg-violet-50 text-violet-700',
  blocked: 'bg-rose-50 text-rose-700',
  completed: 'bg-emerald-50 text-emerald-700',
};
const PRIORITY_STYLE: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-50 text-blue-700',
  high: 'bg-amber-50 text-amber-700',
  urgent: 'bg-rose-50 text-rose-700',
};

// Legacy workbook values and what the import normalises them to (scripts/migrate_excel.py)
const SHEET_ROWS = [
  { heading: 'Implement User Authentication', legacy: 'In Progress', normalised: 'In Progress', owner: '36070586…' },
  { heading: 'Design Database Schema', legacy: 'Completed', normalised: 'Completed', owner: 'c719c246…' },
  { heading: 'Setup CI/CD Pipeline', legacy: 'Pending', normalised: 'To Do', owner: '36070586…' },
  { heading: 'Vendor contract review', legacy: 'Under Review', normalised: 'In Review', owner: 'c719c246…' },
  { heading: '', legacy: 'Blocked', normalised: 'Blocked', owner: '36070586…', flagged: true },
];

const COPILOT_PROMPT = 'Submit Q4 budget report to Alex by next Thursday with urgent priority';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

const useInView = <T extends Element>(threshold = 0.35) => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
};

/* ------------------------------------------------------------------ */
/* Hero: the workspace itself, with a working "Viewing as" switch      */
/* ------------------------------------------------------------------ */

const ScopeStage: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const [viewer, setViewer] = useState<Viewer>('admin');
  const [touched, setTouched] = useState(false);

  // Demonstrate the switch on its own until the visitor takes over
  useEffect(() => {
    if (touched || reduced) return;
    const id = window.setInterval(() => setViewer((v) => (v === 'admin' ? 'user' : 'admin')), 3600);
    return () => window.clearInterval(id);
  }, [touched, reduced]);

  const choose = (v: Viewer) => {
    setTouched(true);
    setViewer(v);
  };

  const visibleCount = viewer === 'admin' ? DEMO_TASKS.length : DEMO_TASKS.filter((t) => t.owner === 'Sarah Jenkins').length;

  return (
    <div className="relative rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(2,6,23,0.6)] ring-1 ring-white/10 overflow-hidden text-left">
      <div className="flex">
        {/* App sidebar, as shipped */}
        <aside className="hidden md:flex w-52 shrink-0 flex-col bg-slate-900 text-slate-300 border-r border-slate-800" aria-hidden="true">
          <div className="h-12 px-4 flex items-center gap-2 border-b border-slate-800/80">
            <span className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-white">HCCDI TaskPilot</span>
          </div>
          <div className="p-3 space-y-1 text-[11px] font-medium">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-indigo-600 text-white">
              <span className="flex items-center gap-2"><CheckSquare className="w-3.5 h-3.5" /> Task List</span>
              <span className="tabular text-[10px] px-1.5 rounded-full bg-indigo-800/80">{visibleCount}</span>
            </div>
            {[
              [Kanban, 'Kanban Board'],
              [Calendar, 'Calendar & Deadlines'],
              [FolderKanban, 'Projects'],
              [BarChart3, 'Productivity Analytics'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Kanban;
              return (
                <div key={label as string} className="flex items-center gap-2 px-2 py-1.5 text-slate-300">
                  <I className="w-3.5 h-3.5 text-slate-500" /> {label as string}
                </div>
              );
            })}
            <div className="pt-3 space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-indigo-300 bg-indigo-950/40 border border-indigo-800/40">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Copilot Chat
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-emerald-300 bg-emerald-950/30 border border-emerald-800/40">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel Sync &amp; Export
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar with the viewer switch */}
          <div className="h-12 px-3 sm:px-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white">
            <span className="hidden sm:block text-xs font-semibold text-slate-800">All tasks</span>
            <div className="flex items-center gap-2 ml-auto" role="radiogroup" aria-label="Viewing as">
              <span className="text-[11px] font-medium text-slate-500">Viewing as</span>
              <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                {([
                  ['admin', 'Alexander', 'Admin'],
                  ['user', 'Sarah', 'User'],
                ] as const).map(([value, name, role]) => (
                  <button
                    key={value}
                    role="radio"
                    aria-checked={viewer === value}
                    onClick={() => choose(value)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      viewer === value ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {name} <span className={viewer === value ? 'text-indigo-600' : ''}>· {role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task table */}
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_5.5rem_8.5rem] lg:grid-cols-[1fr_7rem_5.5rem_8.5rem_4rem] px-3 sm:px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 bg-slate-50/60">
            <span>Task heading</span>
            <span className="hidden sm:block">Status</span>
            <span>Priority</span>
            <span className="hidden sm:block">Assignee</span>
            <span className="hidden lg:block">Due</span>
          </div>
          {/* Fixed height: the stage must not resize (and shift the page) while the viewer toggles */}
          <div className="relative h-[333px]">
          <ul className="text-xs">
            {DEMO_TASKS.map((t) => {
              const hidden = viewer === 'user' && t.owner !== 'Sarah Jenkins';
              return (
                <li
                  key={t.title}
                  aria-hidden={hidden}
                  className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_5.5rem_8.5rem] lg:grid-cols-[1fr_7rem_5.5rem_8.5rem_4rem] items-center px-3 sm:px-4 border-b border-slate-100 overflow-hidden transition-all duration-500 ease-out ${
                    hidden ? 'max-h-0 py-0 opacity-0 border-transparent' : 'max-h-12 py-2.5 opacity-100'
                  }`}
                >
                  <span className="font-semibold text-slate-800 truncate pr-3">{t.title}</span>
                  <span className="hidden sm:block">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${STATUS_STYLE[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                  </span>
                  <span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                  </span>
                  <span className="hidden sm:block text-slate-600 truncate">{t.owner}</span>
                  <span className="hidden lg:block tabular text-slate-500">{t.due}</span>
                </li>
              );
            })}
          </ul>
          <p
            className={`absolute inset-x-0 bottom-0 px-4 pb-5 text-center text-[11px] text-slate-500 transition-opacity duration-500 ${
              viewer === 'user' ? 'opacity-100 delay-300' : 'opacity-0'
            }`}
            aria-hidden={viewer !== 'user'}
          >
            <Lock className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-slate-400" aria-hidden="true" />
            {DEMO_TASKS.length - visibleCount} tasks belong to other people. They don’t exist in Sarah’s scope.
          </p>
          </div>

          {/* Scope footer: what the API says to this viewer */}
          <div className="px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-slate-50 text-[11px]" aria-live="polite">
            <span className="text-slate-600">
              <span className="tabular font-bold text-slate-900">{visibleCount}</span> of 9 tasks visible ·{' '}
              {viewer === 'admin' ? 'organisation scope' : 'own tasks only'}
            </span>
            <code className={`font-mono text-[10.5px] ${viewer === 'admin' ? 'text-emerald-700' : 'text-rose-700'}`}>
              GET /api/tasks/5647ef57… → {viewer === 'admin' ? '200 OK' : '404 Not Found'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Copilot: sentence in, structured task out                            */
/* ------------------------------------------------------------------ */

const CopilotDemo: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(COPILOT_PROMPT.length);
      return;
    }
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= COPILOT_PROMPT.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 28);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const done = typed >= COPILOT_PROMPT.length;

  return (
    <div ref={ref} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-11 px-4 flex items-center gap-2 border-b border-slate-200 bg-indigo-50/70">
        <span className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-bold text-slate-900">AI Task Copilot</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 min-h-[3.25rem]">
          <span className="flex-1">
            {COPILOT_PROMPT.slice(0, typed)}
            {!done && <span className="inline-block w-px h-4 align-middle bg-indigo-600 animate-pulse ml-px" />}
          </span>
          <CornerDownLeft className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" aria-hidden="true" />
        </div>

        <div className={`space-y-3 transition-all duration-500 ${done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="text-base font-bold text-slate-900">Submit Q4 budget report to Alex</div>
          <dl className="flex flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 text-rose-700 font-semibold">
              <dt className="sr-only">Priority</dt><dd>Urgent</dd>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
              <dt className="sr-only">Status</dt><dd>To Do</dd>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <dt className="sr-only">Due</dt><dd>Thursday, 5:00 PM</dd>
            </div>
          </dl>
          <ol className="space-y-1.5 text-xs text-slate-700">
            {[
              'Collect source figures and supporting documents',
              'Reconcile numbers against last period',
              'Draft the report with an executive summary',
              'Circulate for review and incorporate feedback',
              'Submit the final version to the stakeholder',
            ].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-slate-300 bg-white shrink-0" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Excel: the legacy sheet, normalised                                  */
/* ------------------------------------------------------------------ */

const SheetDemo: React.FC = () => (
  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden text-xs">
    <div className="h-11 px-4 flex items-center justify-between gap-2 border-b border-slate-200 bg-emerald-50/70">
      <span className="flex items-center gap-2 font-bold text-slate-900">
        <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Tasks_and_Users.xlsx · Task
      </span>
      <span className="text-[11px] font-semibold text-emerald-700">Import preview</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
            <th className="w-8 border-r border-b border-slate-200 font-semibold" />
            <th className="px-3 py-1.5 text-left border-r border-b border-slate-200 font-semibold">Task Heading</th>
            <th className="px-3 py-1.5 text-left border-r border-b border-slate-200 font-semibold">Task Status</th>
            <th className="px-3 py-1.5 text-left border-b border-slate-200 font-semibold">User ID</th>
          </tr>
        </thead>
        <tbody>
          {SHEET_ROWS.map((r, i) => (
            <tr key={r.heading} className={r.flagged ? 'bg-amber-50/60' : ''}>
              <td className="tabular text-center text-[10px] text-slate-400 bg-slate-50 border-r border-b border-slate-200">{i + 2}</td>
              <td className="px-3 py-2 border-r border-b border-slate-200 text-slate-800">
                {r.flagged ? <span className="text-[11px] font-semibold text-amber-700">Missing title, held back</span> : r.heading}
              </td>
              <td className="px-3 py-2 border-r border-b border-slate-200">
                {r.legacy === r.normalised ? (
                  <span className="text-slate-700">{r.legacy}</span>
                ) : (
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-slate-400 line-through">{r.legacy}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" aria-label="becomes" />
                    <span className="font-semibold text-indigo-700">{r.normalised}</span>
                  </span>
                )}
              </td>
              <td className="px-3 py-2 border-b border-slate-200 font-mono text-[10.5px] text-slate-500">
                {r.owner}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-slate-50 text-[11px] text-slate-600">
      <span><span className="tabular font-bold text-slate-900">4</span> rows ready · <span className="tabular font-bold text-amber-700">1</span> needs a fix</span>
      <span className="font-semibold text-indigo-700">Commit 4 rows</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */

const PROOF = [
  {
    icon: Lock,
    title: "Other people's tasks return 404, not 403",
    body: 'Every query runs through one scope filter, so a probed task ID never even confirms it exists.',
    source: 'backend/app/services/task_service.py',
  },
  {
    icon: KeyRound,
    title: 'Short-lived access, rotating refresh',
    body: 'Access tokens last 60 minutes. Refresh tokens are single-use, stored only as hashes, and revocable at logout.',
    source: 'backend/app/core/security.py',
  },
  {
    icon: ShieldCheck,
    title: 'AI only sees what you can see',
    body: 'Copilot context is built from the requester’s scoped tasks before any prompt is assembled, and it runs fully offline without an API key.',
    source: 'backend/app/services/ai_service.py',
  },
  {
    icon: FlaskConical,
    title: '21 backend tests, isolation included',
    body: 'Auth, IDOR probing, AI parsing and Excel round-trips are covered by the pytest suite that ships with the repo.',
    source: 'backend/tests/',
  },
];

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'HCCDI TaskPilot · Your spreadsheet, rebuilt as a secure AI workspace';
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Stage: nav + hero share the workspace's own slate ground */}
      <header className="bg-slate-900 text-white">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4" aria-label="Main">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <span>HCCDI TaskPilot</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <a href="#how" className="hidden md:inline px-3 py-2 text-slate-300 hover:text-white">How it works</a>
            <a href="#tour" className="hidden md:inline px-3 py-2 text-slate-300 hover:text-white">Tour</a>
            <a href={`${REPO_URL}/tree/main/docs`} className="hidden md:inline px-3 py-2 text-slate-300 hover:text-white">Docs</a>
            <Link to="/login" className="px-3 py-2 text-slate-300 hover:text-white">Sign in</Link>
            <Link
              to="/login?demo=admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors"
            >
              Try the live demo
            </Link>
          </div>
        </nav>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-[2.25rem] leading-[1.05] sm:text-6xl font-bold tracking-[-0.035em] text-balance">
              Your spreadsheet, rebuilt as a secure AI workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              TaskPilot imports the Excel tracker your team already runs on, adds a Copilot that turns a sentence into a
              planned task, and gives every person a workspace scoped to exactly what they are allowed to see.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login?demo=admin"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition-colors"
              >
                Try the live demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#tour"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/5 transition-colors"
              >
                <Play className="w-4 h-4" /> Watch the 20s tour
              </a>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <ScopeStage />
            <p className="mt-4 text-sm text-slate-400">
              Same database, two people. Switch who is looking: Sarah’s workspace simply doesn’t contain Alexander’s work.
            </p>
          </div>
        </section>
      </header>

      <main>
        {/* Excel round-trip */}
        <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-balance">Bring the sheet you already have.</h2>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-prose">
              Upload the team’s .xlsx and TaskPilot dry-runs it first: legacy statuses are mapped, rows missing a title are
              held back, and nothing touches the database until you commit. When a stakeholder still wants a spreadsheet,
              export one with native dropdowns on status and priority.
            </p>
            <ol className="mt-8 space-y-4 text-sm">
              {[
                [Upload, 'Upload', 'Drop in the workbook your team uses today.'],
                [ScanSearch, 'Preview', 'See every mapped value and every row that needs a fix.'],
                [Download, 'Round-trip', 'Commit the clean rows, export back to Excel any time.'],
              ].map(([Icon, title, body]) => {
                const I = Icon as typeof Upload;
                return (
                  <li key={title as string} className="flex gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <I className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900">{title as string}</span>
                      <span className="text-slate-600">{body as string}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <SheetDemo />
        </section>

        {/* Copilot */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <CopilotDemo />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-balance">Type it the way you’d say it.</h2>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-prose">
                The Copilot pulls the title, priority and deadline out of a plain sentence and drafts the checklist. It also
                plans your day, flags overdue work and explains why a task deserves its priority.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-prose">
                No API key? It still works. A deterministic engine runs offline, and connecting an LLM key makes the drafts
                richer.
              </p>
            </div>
          </div>
        </section>

        {/* Video tour */}
        <section id="tour" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-balance max-w-2xl">
            Twenty seconds, start to finish.
          </h2>
          <p className="mt-4 text-slate-600 max-w-prose">From the old spreadsheet to a scoped, AI-planned workspace.</p>
          <div className="mt-10 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-slate-200 shadow-xl aspect-video">
            <video
              className="w-full h-full"
              controls
              playsInline
              preload="metadata"
              poster="/media/taskpilot-tour.jpg"
            >
              <source src="/media/taskpilot-tour.webm" type="video/webm" />
              <source src="/media/taskpilot-tour.mp4" type="video/mp4" />
              Your browser can’t play this video. <a href="/media/taskpilot-tour.mp4">Download the tour (MP4)</a>.
            </video>
          </div>
        </section>

        {/* Proof */}
        <section className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-balance max-w-2xl">
              Built so a shared workspace can be trusted.
            </h2>
            <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {PROOF.map(({ icon: Icon, title, body, source }) => (
                <li key={title} className="py-6 grid gap-3 sm:grid-cols-[2rem_1fr_auto] sm:gap-6 sm:items-baseline">
                  <Icon className="w-5 h-5 text-indigo-400 sm:translate-y-1" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-slate-400 max-w-prose">{body}</p>
                  </div>
                  <a
                    href={`${REPO_URL}/blob/main/${source}`}
                    className="font-mono text-xs text-slate-400 hover:text-indigo-300 underline-offset-4 hover:underline"
                  >
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Close */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.035em] text-balance max-w-3xl">
            Open the workspace as either person.
          </h2>
          <p className="mt-4 text-slate-600 max-w-prose">
            Both demo accounts come from the original workbook. Sign in as each and compare what you can see.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 max-w-3xl">
            <Link
              to="/login?demo=admin"
              className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <span>
                <span className="block text-lg font-semibold">Alexander Wright</span>
                <span className="text-sm text-indigo-100">Admin · whole organisation</span>
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login?demo=user"
              className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-white ring-1 ring-slate-300 hover:ring-indigo-400 transition-colors"
            >
              <span>
                <span className="block text-lg font-semibold text-slate-900">Sarah Jenkins</span>
                <span className="text-sm text-slate-600">User · own tasks only</span>
              </span>
              <ArrowRight className="w-5 h-5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" /> HCCDI TaskPilot · MIT licensed
          </span>
          <span className="flex items-center gap-5">
            <a href={`${REPO_URL}/tree/main/docs`} className="hover:text-slate-900">Documentation</a>
            <a href={REPO_URL} className="inline-flex items-center gap-1.5 hover:text-slate-900">
              <Github className="w-4 h-4" /> Source
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};
