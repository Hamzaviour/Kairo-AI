import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, ShieldCheck, User, FileSpreadsheet, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KairoLockup, KairoMark } from '../components/brand/KairoLogo';

const DEMO_ACCOUNTS: Record<string, { email: string; password: string }> = {
  admin: { email: 'alexander.wright@enterprise.com', password: 'P@ssw0rd!2026' },
  user: { email: 'sarah.jenkins@enterprise.com', password: 'Secur3_Token#88' },
};

const inputClass =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-brand-200/70 transition-colors';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  // The landing page links here with ?demo=admin|user to prefill a demo account
  const demoKey = searchParams.get('demo') ?? '';
  const demo = DEMO_ACCOUNTS[demoKey];
  const [email, setEmail] = useState(demo?.email ?? '');
  const [password, setPassword] = useState(demo?.password ?? '');
  const [picked, setPicked] = useState<string | null>(demo ? demoKey : null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'That email and password don’t match. Check them and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pick = (key: 'admin' | 'user') => {
    setEmail(DEMO_ACCOUNTS[key].email);
    setPassword(DEMO_ACCOUNTS[key].password);
    setPicked(key);
    setError(null);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-white">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-slate-950 text-white p-12">
        <KairoLockup size={28} tone="light" />

        {/* The ring, at poster scale */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 opacity-[0.07] text-white pointer-events-none" aria-hidden="true">
          <KairoMark size={620} variant="bare" />
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-[44px] leading-[1.05] font-semibold">
            Do the right work at the right&nbsp;moment.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-400">
            Kairo turns the spreadsheet your team already runs on into one calm workspace, where everyone sees exactly
            the work that’s theirs.
          </p>
          <ul className="mt-10 space-y-3.5 text-sm text-slate-300">
            {[
              [FileSpreadsheet, 'Excel in, Excel out, nothing lost'],
              [Lock, 'Every person works in their own scope'],
              [Sparkles, 'A Copilot that plans from a sentence'],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Lock;
              return (
                <li key={text as string} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white/[0.06] ring-1 ring-white/10 flex items-center justify-center">
                    <I className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
                  </span>
                  {text as string}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">Kairo · from the Greek <span className="italic">kairos</span>, the opportune moment</p>
      </aside>

      {/* Form */}
      <main className="flex flex-col min-h-screen px-5 sm:px-10 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Home
          </Link>
          <KairoLockup size={22} className="lg:hidden" />
        </div>

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Welcome back. Pick up where you left off.</p>

            {error && (
              <div role="alert" className="mt-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-[13px] text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="group w-full mt-2 py-2.5 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{isLoading ? 'Signing in…' : 'Continue'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <div className="mt-10">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or try a demo account
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {([
                  ['admin', 'Alexander', 'Admin · everything', ShieldCheck],
                  ['user', 'Sarah', 'Member · own tasks', User],
                ] as const).map(([key, name, scope, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => pick(key)}
                    aria-pressed={picked === key}
                    className={`relative p-3 rounded-xl text-left border transition-colors ${
                      picked === key ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {picked === key && <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-brand-400" aria-hidden="true" />}
                    <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                    <div className="mt-2 text-[13px] font-medium text-slate-900">{name}</div>
                    <div className="text-[11px] text-slate-500">{scope}</div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-400 text-center">Both accounts come from the original Excel workbook.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
