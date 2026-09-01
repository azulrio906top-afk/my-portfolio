"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Mail,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "Projects shipped", value: "12+" },
  { label: "Years building", value: "5" },
  { label: "Happy clients", value: "30+" },
];

const skills = [
  "Next.js",
  "TypeScript",
  "Prisma",
  "SQLite",
  "Tailwind CSS",
  "Product design",
];

export default function Home() {
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
              Available for freelance work
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              I design and build digital experiences that feel premium.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              I build polished products for founders and teams who want a fast,
              elegant, high-converting digital presence.
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
                <span className="font-medium text-white">Product UI</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-300" />
                  Email
                </span>
                <span className="font-medium text-white">hello@alex.dev</span>
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
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
            >
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <section id="work" className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Core stack</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 pb-10">
          <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Contact</p>
            <h3 className="mt-3 text-3xl font-bold text-white">
              Let&apos;s build something remarkable.
            </h3>
            <a
              href="mailto:hello@alex.dev"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
            >
              hello@alex.dev
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
