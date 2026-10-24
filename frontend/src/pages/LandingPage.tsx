import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ListChecks, Kanban, CalendarDays, BarChart3, FolderKanban,
  Sparkles, FileSpreadsheet, ArrowRight, Lock, ShieldCheck, KeyRound,
  FlaskConical, Github, Upload, ScanSearch, Download, CornerDownLeft, Play,
} from 'lucide-react';
import { KairoLockup, KairoMark } from '../components/brand/KairoLogo';

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
  in_progress: 'bg-sky-50 text-sky-800',
  in_review: 'bg-violet-50 text-violet-700',
  blocked: 'bg-rose-50 text-rose-700',
  completed: 'bg-emerald-50 text-emerald-700',
};
const STATUS_DOT: Record<Status, string> = {
  backlog: 'bg-slate-300', todo: 'bg-slate-400', in_progress: 'bg-sky-500', in_review: 'bg-violet-500', blocked: 'bg-rose-500', completed: 'bg-emerald-500',
};
const PRIORITY_BARS: Record<Priority, [number, string]> = {
  low: [1, 'text-slate-500'], medium: [2, 'text-sky-700'], high: [3, 'text-orange-700'], urgent: [4, 'text-rose-700'],
};

const PriorityBars: React.FC<{ p: Priority }> = ({ p }) => {
  const [bars, tone] = PRIORITY_BARS[p];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold capitalize ${tone}`}>
      <span className="flex items-end gap-[2px] h-2.5" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`w-[3px] rounded-sm ${n <= bars ? 'bg-current' : 'bg-slate-200'}`} style={{ height: `${n * 25}%` }} />
        ))}
      </span>
      {p}
    </span>
  );
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

  const radios = useRef<Record<Viewer, HTMLButtonElement | null>>({ admin: null, user: null });
  const onSwitchKey = (e: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const next: Viewer = viewer === 'admin' ? 'user' : 'admin';
    choose(next);
    radios.current[next]?.focus();
  };

  const visibleCount = viewer === 'admin' ? DEMO_TASKS.length : DEMO_TASKS.filter((t) => t.owner === 'Sarah Jenkins').length;
  const cols = 'grid-cols-[1fr_auto] sm:grid-cols-[1fr_7.5rem_5.5rem_8.5rem] lg:grid-cols-[1fr_7.5rem_5.5rem_8.5rem_4rem]';

  return (
    <div className="relative rounded-2xl bg-white shadow-stage ring-1 ring-white/10 overflow-hidden text-left">
      <div className="flex">
        {/* App sidebar, as shipped */}
        <aside className="hidden md:flex w-52 shrink-0 flex-col bg-slate-100/80 border-r border-slate-200" aria-hidden="true">
          <div className="h-14 px-4 flex items-center">
            <KairoLockup size={20} />
          </div>
          <div className="px-3 pt-2 space-y-0.5 text-[12px]">
            <div className="relative flex items-center justify-between px-2 py-1.5 rounded-md bg-white ring-1 ring-slate-200/80 shadow-xs text-slate-900 font-medium">
              <span className="absolute -left-2.5 w-1.5 h-1.5 rounded-full bg-brand-400 animate-moment" />
              <span className="flex items-center gap-2"><ListChecks className="w-3.5 h-3.5" strokeWidth={1.75} /> Tasks</span>
              <span className="tabular text-[10px] text-slate-500">{visibleCount}</span>
            </div>
            {[
              [Kanban, 'Board'],
              [CalendarDays, 'Calendar'],
              [FolderKanban, 'Projects'],
              [BarChart3, 'Insights'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Kanban;
              return (
                <div key={label as string} className="flex items-center gap-2 px-2 py-1.5 text-slate-600">
                  <I className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} /> {label as string}
                </div>
              );
            })}
            <div className="pt-4 pb-1 px-2 text-[10px] font-medium text-slate-400">Assist</div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" strokeWidth={1.75} /> Copilot
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-slate-600">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} /> Excel sync
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar with the viewer switch */}
          <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white">
            <span className="hidden sm:block font-display text-[15px] font-semibold text-slate-900">All tasks</span>
            <div className="flex items-center gap-2.5 ml-auto" role="radiogroup" aria-label="Viewing as" onKeyDown={onSwitchKey}>
              <span className="hidden sm:inline text-[13px] text-slate-500">Viewing as</span>
              <div className="flex p-0.5 rounded-xl bg-slate-100 ring-1 ring-slate-200">
                {([
                  ['admin', 'Alexander', 'Admin'],
                  ['user', 'Sarah', 'Member'],
                ] as const).map(([value, name, role]) => (
                  <button
                    key={value}
                    ref={(el) => (radios.current[value] = el)}
                    role="radio"
                    aria-checked={viewer === value}
                    tabIndex={viewer === value ? 0 : -1}
                    onClick={() => choose(value)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-[10px] text-[13px] font-medium transition-colors ${
                      viewer === value ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {name} <span className={viewer === value ? 'text-slate-400' : 'text-slate-400'}>· {role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task table */}
          <div className={`grid ${cols} px-3 sm:px-4 py-2 text-[11px] font-medium text-slate-500 border-b border-slate-100`}>
            <span>Task</span>
            <span className="hidden sm:block">Status</span>
            <span>Priority</span>
            <span className="hidden sm:block">Assignee</span>
            <span className="hidden lg:block">Due</span>
          </div>
          {/* Fixed height: the stage must not resize (and shift the page) while the viewer toggles */}
          <div className="relative h-[333px]">
            <ul className="text-[13px]">
              {DEMO_TASKS.map((t) => {
                const hidden = viewer === 'user' && t.owner !== 'Sarah Jenkins';
                return (
                  <li
                    key={t.title}
                    aria-hidden={hidden}
                    className={`grid ${cols} items-center px-3 sm:px-4 border-b border-slate-100 overflow-hidden transition-[max-height,padding,opacity,border-color] duration-500 ease-out ${
                      hidden ? 'max-h-0 py-0 opacity-0 border-transparent' : 'max-h-12 py-2.5 opacity-100'
                    }`}
                  >
                    <span className="font-medium text-slate-900 truncate pr-3">{t.title}</span>
                    <span className="hidden sm:block">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${STATUS_STYLE[t.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
                        {STATUS_LABEL[t.status]}
                      </span>
                    </span>
                    <span><PriorityBars p={t.priority} /></span>
                    <span className="hidden sm:block text-slate-600 truncate">{t.owner}</span>
                    <span className="hidden lg:block tabular text-slate-500">{t.due}</span>
                  </li>
                );
              })}
            </ul>
            <p
              className={`absolute inset-x-0 bottom-0 px-4 pb-5 text-center text-xs text-slate-500 transition-opacity duration-500 ${
                viewer === 'user' ? 'opacity-100 delay-300' : 'opacity-0'
              }`}
              aria-hidden={viewer !== 'user'}
            >
              <Lock className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-slate-400" aria-hidden="true" />
              {DEMO_TASKS.length - visibleCount} tasks belong to other people. They don’t exist in Sarah’s scope.
            </p>
          </div>

          {/* Scope footer: what the API says to this viewer */}
          <div className="px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-slate-50 border-t border-slate-100 text-xs" aria-live="polite">
            <span className="text-slate-600">
              <span className="tabular font-semibold text-slate-900">{visibleCount}</span> of 9 tasks visible ·{' '}
              {viewer === 'admin' ? 'organisation scope' : 'own tasks only'}
            </span>
            <code className={`font-mono text-[11px] ${viewer === 'admin' ? 'text-emerald-700' : 'text-rose-700'}`}>
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
    <div ref={ref} className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-float overflow-hidden">
      <div className="h-12 px-5 flex items-center gap-2.5 border-b border-slate-100">
        <Sparkles className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
        <span className="text-[13px] font-medium text-slate-900">Copilot</span>
        <span className="ml-auto text-[11px] text-slate-400">Drafted from one sentence</span>
      </div>
      <div className="p-5 sm:p-7 space-y-6">
        <div className="flex items-start gap-2 rounded-xl ring-1 ring-slate-200 bg-slate-50 px-4 py-3 text-sm sm:text-base text-slate-800 min-h-[3.5rem]">
          <span className="flex-1">
            {COPILOT_PROMPT.slice(0, typed)}
            {!done && <span className="inline-block w-[2px] h-4 align-middle bg-brand-500 ml-px animate-pulse" />}
          </span>
          <CornerDownLeft className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" aria-hidden="true" />
        </div>

        <div className={`space-y-4 transition-[opacity,transform] duration-500 ${done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="font-display text-xl sm:text-2xl font-semibold text-slate-900">Submit Q4 budget report to Alex</div>
          <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]">
            <div><dt className="sr-only">Priority</dt><dd><PriorityBars p="urgent" /></dd></div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <dt className="sr-only">Status</dt><dd>To Do</dd>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              <dt className="sr-only">Due</dt><dd>Thursday, 5:00 PM</dd>
            </div>
          </dl>
          <ol className="space-y-2.5 text-[13px] sm:text-sm text-slate-700">
            {[
              'Collect source figures and supporting documents',
              'Reconcile numbers against last period',
              'Draft the report with an executive summary',
              'Circulate for review and incorporate feedback',
              'Submit the final version to the stakeholder',
            ].map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-[5px] ring-1 ring-slate-300 bg-white shrink-0" aria-hidden="true" />
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
  <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-float overflow-hidden text-[13px]">
    <div className="h-12 px-5 flex items-center justify-between gap-2 border-b border-slate-100">
      <span className="flex items-center gap-2 font-medium text-slate-900">
        <FileSpreadsheet className="w-4 h-4 text-emerald-600" strokeWidth={1.75} /> Tasks_and_Users.xlsx
      </span>
      <span className="text-[11px] font-medium text-emerald-700">Import preview</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[22rem] border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] text-slate-500">
            <th className="w-8 border-r border-b border-slate-200 font-medium" />
            <th className="px-3 py-1.5 text-left border-r border-b border-slate-200 font-medium">Task Heading</th>
            <th className="px-3 py-1.5 text-left border-r border-b border-slate-200 font-medium">Task Status</th>
            <th className="px-3 py-1.5 text-left border-b border-slate-200 font-medium">User ID</th>
          </tr>
        </thead>
        <tbody>
          {SHEET_ROWS.map((r, i) => (
            <tr key={r.heading} className={r.flagged ? 'bg-orange-50/70' : ''}>
              <td className="tabular text-center text-[10px] text-slate-400 bg-slate-50 border-r border-b border-slate-200">{i + 2}</td>
              <td className="px-3 py-2 border-r border-b border-slate-200 text-slate-800">
                {r.flagged ? <span className="text-xs font-medium text-orange-700">Missing title, held back</span> : r.heading}
              </td>
              <td className="px-3 py-2 border-r border-b border-slate-200">
                {r.legacy === r.normalised ? (
                  <span className="text-slate-700">{r.legacy}</span>
                ) : (
                  <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span className="text-slate-400 line-through">{r.legacy}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" aria-label="becomes" />
                    <span className="font-medium text-slate-900 bg-brand-100 px-1 rounded">{r.normalised}</span>
                  </span>
                )}
              </td>
              <td className="px-3 py-2 border-b border-slate-200 font-mono text-[11px] text-slate-500">{r.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-5 py-3 flex items-center justify-between gap-3 bg-slate-50 text-xs text-slate-600">
      <span><span className="tabular font-semibold text-slate-900">4</span> rows ready · <span className="tabular font-semibold text-orange-700">1</span> needs a fix</span>
      <span className="inline-flex items-center gap-1 font-medium text-slate-900">Commit 4 rows <ArrowRight className="w-3 h-3" /></span>
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
    body: 'The Copilot and the chat assistant act through the same scoped services as the app. Deletes wait for your explicit yes.',
    source: 'backend/app/services/assistant_service.py',
  },
  {
    icon: FlaskConical,
    title: '28 backend tests, isolation included',
    body: 'Auth, IDOR probing, AI parsing, the assistants and Excel round-trips are covered by the pytest suite in the repo.',
    source: 'backend/tests/',
  },
];

const primaryOnInk =
  'inline-flex items-center gap-2 rounded-xl bg-brand-400 hover:bg-brand-300 text-slate-950 font-medium transition-colors';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Kairo · Do the right work at the right moment';
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Stage: nav + hero on ink */}
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-48 -top-48 text-white opacity-[0.05] pointer-events-none" aria-hidden="true">
          <KairoMark size={760} variant="bare" />
        </div>

        <nav className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4" aria-label="Main">
          <Link to="/" aria-label="Kairo home"><KairoLockup size={26} tone="light" /></Link>
          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <a href="#how" className="hidden md:inline px-3 py-2 text-slate-400 hover:text-white transition-colors">How it works</a>
            <a href="#tour" className="hidden md:inline px-3 py-2 text-slate-400 hover:text-white transition-colors">Tour</a>
            <a href="#trust" className="hidden lg:inline px-3 py-2 text-slate-400 hover:text-white transition-colors">Security</a>
            <a href={`${REPO_URL}/tree/main/docs`} className="hidden md:inline px-3 py-2 text-slate-400 hover:text-white transition-colors">Docs</a>
            <Link to="/login" className="px-3 py-2 text-slate-300 hover:text-white transition-colors">Sign in</Link>
            <Link to="/login?demo=admin" className={`hidden sm:inline-flex px-3.5 py-2 text-sm ${primaryOnInk}`}>
              Try the live demo
            </Link>
          </div>
        </nav>

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-24 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-7xl font-semibold tracking-[-0.03em]">
              Your spreadsheet, rebuilt as a calm, secure AI&nbsp;workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-400">
              Kairo imports the Excel tracker your team already runs on, adds a Copilot that turns a sentence into a
              planned task, and gives every person a workspace scoped to exactly what they are allowed to see.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/login?demo=admin" className={`px-5 py-3 text-[15px] ${primaryOnInk}`}>
                Try the live demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#tour"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[15px] font-medium text-white ring-1 ring-white/15 hover:bg-white/[0.06] transition-colors"
              >
                <Play className="w-4 h-4" /> Watch the 20s tour
              </a>
            </div>
          </div>

          <div className="mt-14 sm:mt-20">
            <ScopeStage />
            <p className="mt-5 text-sm text-slate-500">
              Flip <span className="font-medium text-white">Viewing as</span> to Sarah. Same database, but her workspace
              simply doesn’t contain Alexander’s work.
            </p>
          </div>
        </section>
      </header>

      <main>
        {/* Excel round-trip */}
        <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid gap-12 lg:grid-cols-[0.85fr_1.25fr] lg:items-center scroll-mt-4">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.025em]">Bring the sheet you already have.</h2>
            <p className="mt-5 text-slate-600 leading-relaxed max-w-prose">
              Upload the team’s .xlsx and Kairo dry-runs it first: legacy statuses are mapped, rows missing a title are
              held back, and nothing touches the database until you commit. When a stakeholder still wants a spreadsheet,
              export one with native dropdowns on status and priority.
            </p>
            <ol className="mt-10 space-y-5 text-sm">
              {[
                [Upload, 'Upload', 'Drop in the workbook your team uses today.'],
                [ScanSearch, 'Preview', 'See every mapped value and every row that needs a fix.'],
                [Download, 'Round-trip', 'Commit the clean rows, export back to Excel any time.'],
              ].map(([Icon, title, body]) => {
                const I = Icon as typeof Upload;
                return (
                  <li key={title as string} className="flex gap-4">
                    <span className="w-9 h-9 rounded-xl ring-1 ring-slate-200 bg-white flex items-center justify-center shrink-0">
                      <I className="w-4 h-4 text-slate-700" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block font-medium text-slate-900">{title as string}</span>
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid gap-12 lg:grid-cols-[0.85fr_1.25fr] lg:items-start">
            <div className="lg:pt-8">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.025em]">Type it the way you’d say it.</h2>
              <p className="mt-5 text-slate-600 leading-relaxed max-w-prose">
                The Copilot pulls the title, priority and deadline out of a plain sentence and drafts the checklist. It
                plans your day, flags overdue work and explains why a task deserves its priority, using only tasks in your
                own scope.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-prose">
                Prefer to talk? The assistant in the corner of the workspace creates, edits and closes tasks for you, and
                admins get their own with organisation-wide reach.
              </p>
            </div>
            <CopilotDemo />
          </div>
        </section>

        {/* Tour + proof on ink */}
        <section className="bg-slate-950 text-white">
          <div id="tour" className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 scroll-mt-4">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.025em] max-w-2xl">
              Twenty seconds, start to finish.
            </h2>
            <p className="mt-5 text-slate-400 max-w-prose">From the old spreadsheet to a scoped, AI-planned workspace.</p>
            <div className="mt-12 rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-stage aspect-video">
              <video className="w-full h-full" controls playsInline preload="metadata" poster="/media/kairo-tour.jpg">
                <source src="/media/kairo-tour.webm" type="video/webm" />
                <source src="/media/kairo-tour.mp4" type="video/mp4" />
                Your browser can’t play this video. <a href="/media/kairo-tour.mp4" className="underline">Download the tour (MP4)</a>.
              </video>
            </div>
          </div>
        </section>
        <section id="trust" className="bg-slate-950 text-white scroll-mt-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.025em] max-w-2xl">
              Built so a shared workspace can be trusted.
            </h2>
            <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
              {PROOF.map(({ icon: Icon, title, body, source }) => (
                <li key={title} className="py-7 grid gap-3 sm:grid-cols-[2rem_1fr_auto] sm:gap-6 sm:items-baseline">
                  <Icon className="w-5 h-5 text-brand-400 sm:translate-y-1" strokeWidth={1.75} aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                    <p className="mt-1.5 text-slate-400 max-w-prose">{body}</p>
                  </div>
                  <a
                    href={`${REPO_URL}/blob/main/${source}`}
                    className="font-mono text-xs text-slate-500 hover:text-brand-300 underline-offset-4 hover:underline"
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
          <h2 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.02] tracking-[-0.03em] max-w-3xl">
            Open the workspace as either person.
          </h2>
          <p className="mt-5 text-slate-600 max-w-prose">
            Both demo accounts come from the original workbook. Sign in as each and compare what you can see.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 max-w-3xl">
            <Link
              to="/login?demo=admin"
              className="group relative flex items-center justify-between gap-4 p-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white transition-colors"
            >
              <span>
                <span className="flex items-center gap-2 text-lg font-medium">
                  Alexander Wright <span className="w-1.5 h-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                </span>
                <span className="text-sm text-slate-400">Admin · whole organisation</span>
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login?demo=user"
              className="group flex items-center justify-between gap-4 p-6 rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-slate-400 transition-shadow"
            >
              <span>
                <span className="block text-lg font-medium text-slate-900">Sarah Jenkins</span>
                <span className="text-sm text-slate-600">Member · own tasks only</span>
              </span>
              <ArrowRight className="w-5 h-5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-wrap items-center justify-between gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-4">
            <KairoLockup size={20} />
            <span className="hidden sm:inline text-slate-400">Do the right work at the right moment · MIT licensed</span>
          </span>
          <span className="flex items-center gap-5">
            <Link to="/brand" className="hover:text-slate-900">Brand</Link>
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
