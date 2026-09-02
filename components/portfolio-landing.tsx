'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Code2, ExternalLink, Mail, Sparkles } from 'lucide-react';

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
  return (
    <main className="min-h-screen px-6 py-20 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]"
        >
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
              <Sparkles className="h-4 w-4" />
              Available for selected freelance work
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              I build product experiences that help brands sell more and feel more human.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
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
                className="rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
              >
                View work
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-sky-950/30"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Profile</p>
                <h2 className="text-2xl font-bold text-white">Alex Morgan</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                <Code2 className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sky-300" />
                  Specialization
                </span>
                <span className="font-medium text-white">Product design + build</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-300" />
                  Email
                </span>
                <span className="font-medium text-white">hello@alexmorgan.dev</span>
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
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
            >
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <section id="work" className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Selected work</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Recent launches</h2>
            </div>
            <a href="#contact" className="text-sm text-sky-300 underline-offset-4 hover:underline">
              Start a project
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {projectList.map((project) => {
              const tags = (project.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70"
                >
                  <div
                    className="h-52 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.imageUrl ?? '/placeholder.svg'})` }}
                  />
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                          Portfolio
                        </span>
                      )}
                    </div>
                    <a
                      href={project.url ?? '#'}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200"
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
        </section>

        <section className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Core stack</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {skillList.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 pb-10">
          <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Contact</p>
            <h3 className="mt-3 text-3xl font-bold text-white">Let&apos;s build something remarkable.</h3>
            <a
              href="mailto:hello@alexmorgan.dev"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
            >
              hello@alexmorgan.dev
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
