'use client';

import { Moon, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle({ className = '' }: { className?: string }) {
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

    const isLight = theme === 'light';

    return (
        <button
            type="button"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${className} ${isLight
                    ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
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
    );
}
