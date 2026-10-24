import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Check, Copy, X, Sparkles, Plus } from 'lucide-react';
import { KairoLockup, KairoMark, KairoWordmark } from '../components/brand/KairoLogo';
import { Badge } from '../components/common/Badge';

const ASSETS = [
  { file: 'kairo-lockup.svg', label: 'Lockup · light' },
  { file: 'kairo-lockup-dark.svg', label: 'Lockup · ink' },
  { file: 'kairo-mark.svg', label: 'Mark · tile' },
  { file: 'kairo-mark-ring.svg', label: 'Mark · ring' },
  { file: 'kairo-wordmark.svg', label: 'Wordmark' },
];

const INK = [
  ['950', '#0b0c10', 'Stage'],
  ['900', '#13151a', 'Ink · text, primary'],
  ['700', '#343841', 'Strong'],
  ['500', '#646b78', 'Muted text'],
  ['300', '#c9cdd5', 'Rules on paper'],
  ['200', '#e3e5ea', 'Hairline'],
  ['100', '#f0f1f4', 'Rail'],
  ['50', '#f7f8fa', 'Canvas'],
];

const SAFFRON = [
  ['400', '#ffb224', 'The moment'],
  ['300', '#ffc95c', 'Hover on ink'],
  ['100', '#ffefcc', 'AI wash'],
  ['700', '#9a5d00', 'Text on paper'],
];

const STATES = [
  ['Sky', '#0284c7', 'In progress · medium'],
  ['Violet', '#7c3aed', 'In review'],
  ['Orange', '#c2410c', 'High · held back'],
  ['Rose', '#e11d48', 'Blocked · urgent · error'],
  ['Emerald', '#059669', 'Done · Excel'],
];

const Section: React.FC<{ id: string; title: string; lead: string; children: React.ReactNode }> = ({ id, title, lead, children }) => (
  <section id={id} className="py-16 sm:py-20 border-t border-slate-200 grid gap-10 lg:grid-cols-[16rem_1fr] scroll-mt-6">
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{lead}</p>
    </div>
    <div className="min-w-0">{children}</div>
  </section>
);

const Swatch: React.FC<{ name: string; hex: string; role: string; dark?: boolean }> = ({ name, hex, role, dark }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard can be blocked; the hex stays visible to copy by hand
    }
  };
  return (
    <button onClick={copy} className="group text-left" aria-label={`Copy ${hex}`}>
      <span className="block h-20 rounded-xl ring-1 ring-inset ring-black/5" style={{ background: hex }} />
      <span className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-slate-900">{name}</span>
        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500 group-hover:text-slate-900">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
          {hex}
        </span>
      </span>
      <span className={`block text-[11px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{role}</span>
    </button>
  );
};

export const BrandPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Kairo · Brand kit';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.06] text-white pointer-events-none" aria-hidden="true">
          <KairoMark size={640} variant="bare" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="h-16 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Kairo
            </Link>
            <a href="/brand/kairo-lockup.svg" download className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <Download className="w-4 h-4" /> Logo files
            </a>
          </nav>
          <div className="py-16 sm:py-24 max-w-3xl">
            <KairoLockup size={56} tone="light" />
            <h1 className="mt-12 font-display text-5xl sm:text-7xl font-semibold leading-[1.02] tracking-[-0.03em]">Brand kit</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-2xl">
              <span className="text-white">Kairo</span> comes from the Greek <span className="italic">kairos</span>: not clock
              time, but the right moment. The product tells each person what deserves their attention now, inside a
              workspace that only holds their own work. The brand says that quietly: deep ink, generous space, and one
              saffron dot for <span className="text-brand-400">now</span>.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <Section id="logo" title="Logo" lead="An open ring, the cycle of work, with a saffron dot sitting in its gap: the moment the right task arrives. The wordmark is drawn from the same 3px monoline stroke, and its i carries the same dot.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-56 rounded-2xl ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center">
              <KairoLockup size={52} />
            </div>
            <div className="h-56 rounded-2xl bg-slate-950 flex items-center justify-center">
              <KairoLockup size={52} tone="light" />
            </div>
            <div className="h-40 rounded-2xl ring-1 ring-slate-200 flex items-center justify-center gap-6">
              <KairoMark size={64} />
              <KairoMark size={40} />
              <KairoMark size={24} />
              <KairoMark size={16} />
            </div>
            <div className="h-40 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
              <KairoWordmark height={44} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3 text-sm">
            <div>
              <h3 className="font-medium text-slate-900">Clear space</h3>
              <p className="mt-1 text-slate-500">Keep half the mark’s width empty on every side of the lockup.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Minimum size</h3>
              <p className="mt-1 text-slate-500">Mark 16px, lockup 20px tall on screen. Below that, use the mark alone.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">The dot stays saffron</h3>
              <p className="mt-1 text-slate-500">On every ground. Only one-colour print turns the whole logo, dot included, to ink.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['Don’t recolour the ring', 'saffron ring'],
              ['Don’t close the gap', 'closed'],
              ['Don’t set it in a typeface', 'typed'],
            ].map(([rule, kind]) => (
              <div key={kind} className="rounded-xl ring-1 ring-slate-200 p-4">
                <div className="h-16 flex items-center justify-center">
                  {kind === 'saffron ring' && (
                    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <path d="M23.94 15.03A8 8 0 1 1 16.97 8.06" stroke="#ffb224" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="21.66" cy="10.34" r="2.6" fill="#13151a" />
                    </svg>
                  )}
                  {kind === 'closed' && (
                    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <circle cx="16" cy="16" r="8" stroke="#13151a" strokeWidth="3" />
                      <circle cx="16" cy="16" r="2.6" fill="#ffb224" />
                    </svg>
                  )}
                  {kind === 'typed' && <span className="text-3xl font-serif text-slate-900">Kairo</span>}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[13px] text-slate-600">
                  <X className="w-3.5 h-3.5 text-rose-600" /> {rule}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {ASSETS.map((a) => (
              <a
                key={a.file}
                href={`/brand/${a.file}`}
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg ring-1 ring-slate-200 hover:ring-slate-400 text-[13px] text-slate-700 transition-shadow"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" /> {a.label}
              </a>
            ))}
          </div>
        </Section>

        <Section id="colour" title="Colour" lead="Restrained by design. Ink carries the interface; saffron appears only where something is happening now: the current place, the AI, focus, the logo dot. State colours keep one fixed meaning each. Click any swatch to copy it.">
          <h3 className="text-[13px] font-medium text-slate-500">Ink</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-5">
            {INK.map(([step, hex, role]) => <Swatch key={step} name={`Ink ${step}`} hex={hex} role={role} />)}
          </div>
          <h3 className="mt-10 text-[13px] font-medium text-slate-500">Saffron</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-5">
            {SAFFRON.map(([step, hex, role]) => <Swatch key={step} name={`Saffron ${step}`} hex={hex} role={role} />)}
          </div>
          <h3 className="mt-10 text-[13px] font-medium text-slate-500">State</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-x-3 gap-y-5">
            {STATES.map(([name, hex, role]) => <Swatch key={name} name={name} hex={hex} role={role} />)}
          </div>
          <div className="mt-10 rounded-2xl ring-1 ring-slate-200 p-5 flex items-center gap-4">
            <div className="flex h-3 flex-1 rounded-full overflow-hidden">
              <span className="bg-slate-50" style={{ flex: 52 }} />
              <span className="bg-white" style={{ flex: 20 }} />
              <span className="bg-slate-900" style={{ flex: 20 }} />
              <span className="bg-slate-300" style={{ flex: 6 }} />
              <span className="bg-brand-400" style={{ flex: 2 }} />
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">Proportion on a working screen</span>
          </div>
        </Section>

        <Section id="type" title="Typography" lead="Funnel Display gives headlines a soft, confident voice. Geist does the daily work in tables and forms. Geist Mono is only for IDs, paths and data. All three are free on Google Fonts.">
          <div className="space-y-8">
            <div className="rounded-2xl ring-1 ring-slate-200 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 text-xs text-slate-500">
                <span>Funnel Display · Semibold</span><span>Headlines</span>
              </div>
              <p className="mt-4 font-display text-5xl sm:text-6xl font-semibold leading-[1.02] tracking-[-0.03em] text-slate-900">
                The right work, right now.
              </p>
            </div>
            <div className="rounded-2xl ring-1 ring-slate-200 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 text-xs text-slate-500">
                <span>Geist · Regular, Medium</span><span>Interface</span>
              </div>
              <p className="mt-4 text-lg text-slate-900">Prepare Q4 budget report</p>
              <p className="mt-1 text-sm text-slate-500 max-w-prose">
                Due Thursday at 5:00 PM · 3 of 5 subtasks done · assigned to Alexander Wright
              </p>
            </div>
            <div className="rounded-2xl ring-1 ring-slate-200 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 text-xs text-slate-500">
                <span>Geist Mono · Regular</span><span>Data only</span>
              </div>
              <p className="mt-4 font-mono text-sm text-slate-700">GET /api/tasks/5647ef57 → 404 Not Found</p>
            </div>
          </div>
        </Section>

        <Section id="ui" title="Interface" lead="Primary actions are ink. Rounded but never pill-shaped. Hairline borders at rest; soft shadows only for things that float. Priority reads as signal bars, status as a dot and a word.">
          <div className="rounded-2xl ring-1 ring-slate-200 bg-slate-50 p-6 sm:p-8 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium shadow-xs transition-colors">
                <Plus className="w-4 h-4" /> New task
              </button>
              <button className="px-3 py-2 rounded-lg bg-white ring-1 ring-slate-200 hover:ring-slate-300 text-[13px] font-medium text-slate-800 transition-shadow">
                Secondary
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200/60 text-[13px] font-medium text-slate-700 transition-colors">
                <Sparkles className="w-4 h-4 text-brand-600" /> Copilot
              </button>
              <button className="px-3 py-2 rounded-lg bg-brand-400 hover:bg-brand-300 text-[13px] font-medium text-slate-950 transition-colors">
                On ink only
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'completed'].map((s) => <Badge key={s} type="status" value={s} />)}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {['low', 'medium', 'high', 'urgent'].map((p) => <Badge key={p} type="priority" value={p} />)}
              <Badge type="role" value="admin" />
              <Badge type="role" value="user" />
            </div>
          </div>
        </Section>

        <Section id="voice" title="Voice" lead="Calm, direct, specific. Kairo talks like a good colleague who has already read the spreadsheet.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Say', 'Three tasks are overdue. Start with the Q4 report, it blocks two others.', true],
              ['Not', 'Supercharge your productivity with AI-powered insights!', false],
              ['Say', 'Sarah can’t see this task. It belongs to Alexander.', true],
              ['Not', 'Error 403: Access to resource denied.', false],
            ].map(([k, text, good], i) => (
              <div key={i} className={`rounded-xl p-5 ${good ? 'bg-slate-950 text-white' : 'ring-1 ring-slate-200'}`}>
                <span className={`text-[11px] font-medium ${good ? 'text-brand-400' : 'text-rose-600'}`}>{k as string}</span>
                <p className={`mt-2 text-[15px] leading-relaxed ${good ? '' : 'text-slate-500 line-through decoration-slate-300'}`}>{text as string}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 text-sm">
            <li><span className="font-medium text-slate-900">Name the thing.</span> <span className="text-slate-500">Tasks, sheets, scopes. Never “items” or “resources”.</span></li>
            <li><span className="font-medium text-slate-900">Explain the why.</span> <span className="text-slate-500">Every suggestion carries its reason in one line.</span></li>
            <li><span className="font-medium text-slate-900">No hype.</span> <span className="text-slate-500">No “supercharge”, “revolutionise” or exclamation marks.</span></li>
          </ul>
        </Section>
      </main>
    </div>
  );
};
