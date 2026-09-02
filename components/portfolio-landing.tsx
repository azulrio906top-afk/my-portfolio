'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Code2, ExternalLink, Mail, Moon, Sparkles, SunMedium } from 'lucide-react';
import PortfolioChatbot from "@/components/portfolio-chatbot";

type SkillItem = { id: number; name: string };
type ProjectItem = {
    id: number;
    title: string;
    summary: string;
    status: string;
    url?: string | null;
    imageUrl?: string | null;
    tags?: string | null;
};

export function PortfolioLanding({
    skillList,
    projectList,
}: {
    skillList: SkillItem[];
    projectList: ProjectItem[];
}) {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const [showAllProjects, setShowAllProjects] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const nextTheme = savedTheme === 'dark' ? 'dark' : 'light';
        setTheme(nextTheme);
        document.documentElement.dataset.theme = nextTheme;
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    const isLight = theme === 'light';
    const visibleProjects = showAllProjects ? projectList : projectList.slice(0, 3);
    const hasMoreProjects = projectList.length > 3;

    const shellClass = isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-50';
    const pillClass = isLight
        ? 'border-sky-200 bg-sky-100 text-sky-700'
        : 'border-sky-400/40 bg-sky-500/10 text-sky-200';
    const softSurface = isLight
        ? 'border-slate-200 bg-white/80 shadow-slate-200/60'
        : 'border-slate-800 bg-slate-900/70 shadow-sky-950/30';
    const cardClass = isLight
        ? 'border-slate-200 bg-white/80 text-slate-700'
        : 'border-slate-800 bg-slate-900/70 text-slate-300';
    const badgeClass = isLight
        ? 'border-slate-200 bg-slate-100 text-slate-700'
        : 'border-slate-700 bg-slate-950/60 text-slate-200';
    const secondaryButton = isLight
        ? 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
        : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800';
    const mutedText = isLight ? 'text-slate-600' : 'text-slate-300';
    const headingText = isLight ? 'text-slate-900' : 'text-white';
    const subHeadingText = isLight ? 'text-slate-700' : 'text-slate-400';
    const stats = [
        {
            value: `${projectList.length}+`,
            label: "Projects shipped",
        },
        {
            value: "6",
            label: "Years building",
        },
        {
            value: "30+",
            label: "Happy clients",
        },
    ];

    return (
        <main className={`min-h-screen px-6 py-20 transition-colors duration-200 ${shellClass}`}>
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() =>
                            setTheme(
                                isLight ? "dark" : "light",
                            )
                        }
                        className={`
                            group relative
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full
                            border
                            transition
                            ${isLight
                                ? "border-slate-200 bg-white hover:bg-slate-50"
                                : "border-slate-800 bg-slate-900 hover:bg-slate-800"
                            }
                        `}
                        aria-label="Toggle color theme"
                    >
                        {isLight ? (
                            <Moon className="h-4 w-4 text-slate-700" />
                        ) : (
                            <SunMedium className="h-4 w-4 text-amber-400" />
                        )}
                    </button>
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]"
                >
                    <div>
                        <div className={`mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${pillClass}`}>
                            <Sparkles className="h-4 w-4" />
                            Available for selected freelance work
                        </div>

                        <h1
                            className={`
                                max-w-4xl
                                text-5xl
                                font-black
                                leading-[0.95]
                                tracking-[-0.04em]
                                sm:text-6xl
                                lg:text-7xl
                                ${headingText}
                            `}
                        >
                            I build digital products
                            <span className="text-sky-500">
                                {" "}people actually want
                            </span>{" "}
                            to use.
                        </h1>
                        {/* <h1 className={`max-w-xl text-5xl font-black tracking-tight sm:text-6xl ${headingText}`}>
                            I build product experiences that help brands sell more and feel more human.
                        </h1> */}

                        <p
                            className={`
                                mt-7
                                max-w-2xl
                                text-base
                                leading-7
                                sm:text-lg
                                ${mutedText}
                            `}
                        >
                            Full-stack developer and product designer
                            helping ambitious businesses turn ideas into
                            fast, elegant and measurable digital products.
                        </p>

                        {/* <p className={`mt-6 max-w-xl text-lg ${mutedText}`}>
                            I’m a product designer and full-stack developer helping startups and growing businesses create conversion-focused websites, dashboards, and digital experiences that are fast, elegant, and measurable.
                        </p> */}

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400"
                            >
                                Let&apos;s talk...
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#work"
                                className={`rounded-full border px-5 py-3 font-medium transition ${secondaryButton}`}
                            >
                                View work
                            </a>
                            <a
                                href="/admin"
                                className="rounded-full border border-sky-500/40 bg-sky-500/10 px-5 py-3 font-medium text-sky-600 transition hover:border-sky-400 hover:bg-sky-500/15"
                            >
                                Admin
                            </a>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`rounded-3xl border p-6 shadow-2xl ${softSurface}`}
                    >
                        <div
                            className={`
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                p-7
                                shadow-2xl
                                ${softSurface}
                            `}
                        >
                            <div
                                className="
                                    absolute
                                    -right-20
                                    -top-20
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-sky-400/10
                                    blur-3xl
                                "
                            />

                            <div className="relative">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p
                                            className={`
                                                text-xs
                                                uppercase
                                                tracking-[0.2em]
                                                ${subHeadingText}
                                            `}
                                        >
                                            Developer / Designer
                                        </p>

                                        <h2
                                            className={`
                                                mt-2
                                                text-3xl
                                                font-black
                                                tracking-tight
                                                ${headingText}
                                            `}
                                        >
                                            Flunco Ruiz
                                        </h2>
                                    </div>

                                    <div
                                        className="
                                            flex h-12 w-12
                                            items-center justify-center
                                            rounded-2xl
                                            bg-sky-500
                                            text-white
                                            shadow-lg
                                            shadow-sky-500/20
                                        "
                                    >
                                        <Code2 className="h-5 w-5" />
                                    </div>
                                </div>

                                <div
                                    className="
                                        mt-8
                                        flex items-center gap-3
                                        rounded-2xl
                                        border border-emerald-200
                                        bg-emerald-50
                                        px-4 py-3
                                        text-sm
                                        text-emerald-700
                                    "
                                >
                                    <span
                                        className="
                                            h-2
                                            w-2
                                            rounded-full
                                            bg-emerald-500
                                        "
                                    />

                                    Available for selected projects
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div
                                        className={`
                                            rounded-2xl
                                            border
                                            p-4
                                            ${badgeClass}
                                        `}
                                    >
                                        <p className="text-xs text-slate-400">
                                            SPECIALIZATION
                                        </p>

                                        <p
                                            className={`
                                                mt-1
                                                font-semibold
                                                ${headingText}
                                            `}
                                        >
                                            Full Stack Development
                                        </p>
                                    </div>

                                    <div
                                        className={`
                                            rounded-2xl
                                            border
                                            p-4
                                            ${badgeClass}
                                        `}
                                    >
                                        <p className="text-xs text-slate-400">
                                            FOCUS
                                        </p>

                                        <p
                                            className={`
                                                mt-1
                                                font-semibold
                                                ${headingText}
                                            `}
                                        >
                                            Products · SaaS · Dashboards
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                <section className="mt-20 grid gap-6 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`rounded-2xl border p-6 ${cardClass}`}
                        >
                            <p className={`text-3xl font-black ${headingText}`}>{stat.value}</p>
                            <p className={`mt-2 text-sm ${subHeadingText}`}>{stat.label}</p>
                        </motion.div>
                    ))}
                </section>

                <section id="work" className="mt-20">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Selected work</p>
                            <h2 className={`mt-2 text-3xl font-bold ${headingText}`}>Recent launches</h2>
                        </div>
                        <a href="#contact" className="text-sm text-sky-500 underline-offset-4 hover:underline">
                            Start a project
                        </a>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {visibleProjects.map((project) => {
                            const tags = (project.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);

                            return (
                                <motion.article
                                    key={project.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`overflow-hidden rounded-3xl border ${cardClass}`}
                                >
                                    <div
                                        className="h-52 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${project.imageUrl ?? '/placeholder.svg'})` }}
                                    />
                                    <div className="p-5">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <h3 className={`text-xl font-semibold ${headingText}`}>{project.title}</h3>
                                            <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${isLight ? 'border-slate-200 bg-slate-100 text-slate-600' : 'border-slate-700 bg-slate-950 text-slate-300'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${mutedText}`}>{project.summary}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {tags.length > 0 ? (
                                                tags.map((tag) => (
                                                    <span key={tag} className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                                                        }`}>
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                                                    }`}>
                                                    Portfolio
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={project.url ?? '#'}
                                            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Visit project
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>

                    {hasMoreProjects ? (
                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                onClick={() => setShowAllProjects((current) => !current)}
                                className={`rounded-full border px-5 py-3 text-sm font-medium transition ${secondaryButton}`}
                            >
                                {showAllProjects ? 'Show less' : 'Show more'}
                            </button>
                        </div>
                    ) : null}
                </section>

                <section className={`mt-20 rounded-3xl border p-8 ${cardClass}`}>
                    <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Core stack</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {skillList.map((skill) => (
                            <span
                                key={skill.id}
                                className={`rounded-full border px-4 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'
                                    }`}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="mt-24">
                    <div className="max-w-2xl">
                        <p className="text-xs uppercase tracking-[0.25em] text-sky-500">
                            What I do
                        </p>

                        <h2
                            className={`
                                mt-3
                                text-4xl
                                font-black
                                tracking-tight
                                ${headingText}
                            `}
                        >
                            From idea to
                            production.
                        </h2>

                        <p
                            className={`
                                mt-4
                                leading-7
                                ${mutedText}
                            `}
                        >
                            I help businesses design, build and improve
                            digital products that are useful, fast and
                            easy to maintain.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        {[
                            {
                                number: "01",
                                title: "Build a new product",
                                text: "Turn an idea into a polished, production-ready web application.",
                            },
                            {
                                number: "02",
                                title: "Modernize an existing app",
                                text: "Improve performance, UX, architecture and maintainability.",
                            },
                            {
                                number: "03",
                                title: "Business dashboards",
                                text: "Create internal tools, reporting systems and workflow applications.",
                            },
                            {
                                number: "04",
                                title: "AI-powered experiences",
                                text: "Add useful AI assistants, automation and intelligent search.",
                            },
                        ].map((item) => (
                            <article
                                key={item.number}
                                className={`
                                    rounded-[24px]
                                    border
                                    p-6
                                    transition
                                    hover:-translate-y-1
                                    ${cardClass}
                                `}
                            >
                                <span className="text-xs font-bold text-sky-500">
                                    {item.number}
                                </span>

                                <h3
                                    className={`
                                        mt-6
                                        text-xl
                                        font-bold
                                        ${headingText}
                                    `}
                                >
                                    {item.title}
                                </h3>

                                <p
                                    className={`
                                        mt-3
                                        text-sm
                                        leading-6
                                        ${mutedText}
                                    `}
                                >
                                    {item.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
                <section id="contact" className="mt-20 pb-10">
                    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-8 text-center">
                        <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Contact</p>
                        <h3 className={`mt-3 text-3xl font-bold ${headingText}`}>Let&apos;s build something remarkable.</h3>
                        <a
                            href="mailto:azulrio906top@gmail.com"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
                        >
                            azulrio906top@gmail.com
                        </a>
                    </div>
                </section>
            </div>
            <PortfolioChatbot />
        </main>
    );
}
