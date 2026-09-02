"use client";

import { Suspense, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Moon, SunMedium } from 'lucide-react';

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#020817] text-white">Loading...</div>}>
            <AdminLoginForm />
        </Suspense>
    );
}

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('admin@portfolio.dev');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const nextTheme = savedTheme === 'light' ? 'light' : 'dark';
        setTheme(nextTheme);
        document.documentElement.dataset.theme = nextTheme;
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';
    const isLight = theme === 'light';

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid email or password.');
            setLoading(false);
            return;
        }

        router.push(callbackUrl);
        router.refresh();
    }

    return (
        <main className={`relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#020817] text-slate-50'}`}>
            <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),transparent_20%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),transparent_25%)]'}`} />
            <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute bottom-10 right-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="mb-5 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setTheme(isLight ? 'dark' : 'light')}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${isLight ? 'border-slate-300 bg-white text-slate-800' : 'border-slate-700 bg-slate-900 text-slate-100'
                            }`}
                        aria-label="Toggle color theme"
                    >
                        {isLight ? <Moon className="h-6 w-6" /> : <SunMedium className="h-6 w-6" />}
                        {isLight ? (
                            <SunMedium className={`
                                absolute h-5 w-5
                                text-amber-500
                                transition-all duration-500
                                ${isLight
                                    ? "rotate-90 scale-0 opacity-0"
                                    : "rotate-0 scale-100 opacity-100"
                                }
                            `} />
                        ) : (
                            <Moon
                                className={`
                                    absolute h-5 w-5
                                    text-blue-400
                                    transition-all duration-500
                                    ${isLight
                                        ? "rotate-0 scale-100 opacity-100"
                                        : "-rotate-90 scale-0 opacity-0"
                                    }
                                `}
                            />
                        )}
                    </button>
                </div>

                <div className={`rounded-[28px] border p-7 shadow-[0_30px_80px_rgba(2,6,23,0.9)] backdrop-blur-xl ${isLight ? 'border-slate-200 bg-white/80' : 'border-slate-700/80 bg-slate-900/80'
                    }`}>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className={`text-xs font-medium uppercase tracking-[0.32em] ${isLight ? 'text-sky-600' : 'text-sky-300'}`}>Admin</p>
                            <h1 className={`mt-3 text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Welcome back</h1>
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-semibold ${isLight ? 'border-sky-200 bg-sky-100 text-sky-700' : 'border-sky-400/30 bg-sky-500/10 text-sky-300'
                            }`}>
                            A
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className={`w-full rounded-2xl border px-4 py-3 text-base placeholder:text-slate-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${isLight ? 'border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-400' : 'border-slate-700 bg-slate-950/80 text-white focus:border-sky-400'
                                    }`}
                                placeholder="admin@portfolio.dev"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className={`w-full rounded-2xl border px-4 py-3 text-base placeholder:text-slate-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${isLight ? 'border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-400' : 'border-slate-700 bg-slate-950/80 text-white focus:border-sky-400'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error ? (
                            <div className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700/80 bg-slate-950/60 text-slate-200'}`}>
                                {error}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 px-4 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className={`mt-6 rounded-2xl border px-3 py-2 text-center text-xs ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-700/70 bg-slate-950/60 text-slate-400'
                        }`}>
                        Demo credentials: <span className={isLight ? 'font-medium text-slate-800' : 'font-medium text-slate-200'}>admin@portfolio.dev</span> / <span className={isLight ? 'font-medium text-slate-800' : 'font-medium text-slate-200'}>admin123</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
