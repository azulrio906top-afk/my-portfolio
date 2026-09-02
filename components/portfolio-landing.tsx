'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Code2, ExternalLink, Mail, Moon, Sparkles, SunMedium } from 'lucide-react';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAllProjects, setShowAllProjects] = useState(false);

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

  return (
    <main className={`min-h-screen px-6 py-20 transition-colors duration-200 ${shellClass}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
              isLight ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50' : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
            }`}
            aria-label="Toggle color theme"
          >
            {isLight ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            {isLight ? 'Dark' : 'Light'} mode
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

            <h1 className={`max-w-xl text-5xl font-black tracking-tight sm:text-6xl ${headingText}`}>
              I build product experiences that help brands sell more and feel more human.
            </h1>

            <p className={`mt-6 max-w-xl text-lg ${mutedText}`}>
              I’m a product designer and full-stack developer helping startups and growing businesses create conversion-focused websites, dashboards, and digital experiences that are fast, elegant, and measurable.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400"
              >
                Let&apos;s talk
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
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${subHeadingText}`}>Profile</p>
                <h2 className={`text-2xl font-bold ${headingText}`}>Alex Morgan</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                <Code2 className="h-6 w-6" />
              </div>
            </div>

            <div className={`space-y-4 text-sm ${mutedText}`}>
              <div className={`flex items-center justify-between rounded-2xl border p-3 ${badgeClass}`}>
                <span className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sky-300" />
                  Specialization
                </span>
                <span className={isLight ? 'font-medium text-slate-900' : 'font-medium text-white'}>Product design + build</span>
              </div>
              <div className={`flex items-center justify-between rounded-2xl border p-3 ${badgeClass}`}>
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-300" />
                  Email
                </span>
                <span className={isLight ? 'font-medium text-slate-900' : 'font-medium text-white'}>hello@alexmorgan.dev</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <section className="mt-20 grid gap-6 sm:grid-cols-3">
          {[
            { label: 'Projects shipped', value: '12+' },
            { label: 'Years building', value: '6' },
            { label: 'Happy clients', value: '30+' },
          ].map((stat) => (
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
                      <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
                        isLight ? 'border-slate-200 bg-slate-100 text-slate-600' : 'border-slate-700 bg-slate-950 text-slate-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className={`text-sm ${mutedText}`}>{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <span key={tag} className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
                            isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
                          isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
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
                className={`rounded-full border px-4 py-2 text-sm ${
                  isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'
                }`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 pb-10">
          <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Contact</p>
            <h3 className={`mt-3 text-3xl font-bold ${headingText}`}>Let&apos;s build something remarkable.</h3>
            <a
              href="mailto:hello@alexmorgan.dev"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
            >
              hello@alexmorgan.dev
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
