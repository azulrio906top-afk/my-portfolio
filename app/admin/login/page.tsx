'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@portfolio.dev');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError('Invalid email address or password.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main
      className={
        dark
          ? 'relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-5 py-10 text-white'
          : 'relative flex min-h-screen items-center justify-center overflow-hidden bg-[#edf4f9] px-5 py-10 text-slate-950'
      }
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={
            dark
              ? 'absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl'
              : 'absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl'
          }
        />

        <div
          className={
            dark
              ? 'absolute -bottom-40 -right-20 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl'
              : 'absolute -bottom-40 -right-20 h-[32rem] w-[32rem] rounded-full bg-blue-300/20 blur-3xl'
          }
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15,23,42,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.8) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      {/* Theme button */}
      <button
        type="button"
        onClick={() => setDark((current) => !current)}
        className={
          dark
            ? 'absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-slate-800'
            : 'absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white'
        }
        aria-label="Toggle theme"
      >
        {dark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* Login card */}
      <section
        className={
          dark
            ? 'relative z-10 w-full max-w-md rounded-[32px] border border-slate-800 bg-slate-900/80 p-7 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-9'
            : 'relative z-10 w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-[0_30px_90px_rgba(15,23,42,.22)] backdrop-blur-xl sm:p-9'
        }
      >
        {/* Top accent */}
        <div className="absolute left-8 right-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin portal
            </div>

            <h1
              className={
                dark
                  ? 'text-4xl font-black tracking-[-0.04em] text-white'
                  : 'text-4xl font-black tracking-[-0.04em] text-slate-950'
              }
            >
              Welcome back
            </h1>

            <p
              className={
                dark
                  ? 'mt-3 text-sm leading-6 text-slate-400'
                  : 'mt-3 text-sm leading-6 text-slate-500'
              }
            >
              Sign in to manage your portfolio, projects and skills.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-300/40 bg-sky-500/10 text-sky-500">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className={
                dark
                  ? 'mb-2 block text-sm font-medium text-slate-300'
                  : 'mb-2 block text-sm font-medium text-slate-700'
              }
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                className={
                  dark
                    ? 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500'
                    : 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400'
                }
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className={
                  dark
                    ? 'h-13 w-full rounded-2xl border border-slate-700 bg-slate-950/70 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10'
                    : 'h-13 w-full rounded-2xl border border-slate-300 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10'
                }
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className={
                  dark
                    ? 'text-sm font-medium text-slate-300'
                    : 'text-sm font-medium text-slate-700'
                }
              >
                Password
              </label>
            </div>

            <div className="relative">
              <LockKeyhole
                className={
                  dark
                    ? 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500'
                    : 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400'
                }
              />

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className={
                  dark
                    ? 'h-13 w-full rounded-2xl border border-slate-700 bg-slate-950/70 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10'
                    : 'h-13 w-full rounded-2xl border border-slate-300 bg-slate-50/70 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10'
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-500/10 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) =>
                setRemember(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 accent-sky-500"
            />

            <span
              className={
                dark
                  ? 'text-sm text-slate-400'
                  : 'text-sm text-slate-500'
              }
            >
              Keep me signed in
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 font-semibold text-white shadow-lg shadow-sky-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>
              {loading ? 'Signing in...' : 'Sign in'}
            </span>

            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          className={
            dark
              ? 'mt-6 rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-center'
              : 'mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center'
          }
        >
          <p
            className={
              dark
                ? 'text-[11px] text-slate-500'
                : 'text-[11px] text-slate-500'
            }
          >
            Demo credentials
          </p>

          <p
            className={
              dark
                ? 'mt-1 text-xs font-medium text-slate-300'
                : 'mt-1 text-xs font-medium text-slate-700'
            }
          >
            admin@portfolio.dev
            <span className="mx-2 text-slate-400">/</span>
            admin123
          </p>
        </div>

        {/* Footer */}
        <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Secure portfolio administration
        </div>
      </section>

      {/* Bottom branding */}
      <div className="absolute bottom-5 left-0 right-0 z-10 text-center">
        <p
          className={
            dark
              ? 'text-[11px] tracking-wide text-slate-600'
              : 'text-[11px] tracking-wide text-slate-400'
          }
        >
          FLUNCO RUIZ · PORTFOLIO
        </p>
      </div>
    </main>
  );
}