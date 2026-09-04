import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";

import { ensureDatabase, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await ensureDatabase();
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  };
}

export default async function ProjectCaseStudy({ params }: PageProps) {
  await ensureDatabase();
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) {
    return (
      <main className="min-h-screen bg-[#070b12] px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-400">404</p>
          <h1 className="mt-4 text-4xl font-black">Project not found</h1>
          <Link href="/#work" className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950">
            <ArrowLeft className="h-4 w-4" /> Back to work
          </Link>
        </div>
      </main>
    );
  }

  const tags = project.tags.split(",").map((tag : string) => tag.trim()).filter(Boolean);
  const hasLiveUrl = Boolean(project.url);
  const hasGithub = Boolean(project.githubUrl);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b12] text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_5%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(99,102,241,0.12),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <Link href="/#work" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to selected work
        </Link>

        <header className="mt-14 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
              {project.status || "Project"}
            </span>
            <span className="text-xs font-semibold text-slate-500">Case study</span>
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl">
            {project.title}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {hasLiveUrl ? (
              <a href={project.url!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400">
                Live demo <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Not deployed yet
              </span>
            )}
            {hasGithub && (
              <a href={project.githubUrl!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                {/*<Github className="h-4 w-4" />*/} Source code
              </a>
            )}
          </div>
        </header>

        <div className="mt-14 overflow-hidden rounded-[30px] border border-white/10 bg-slate-950 p-2 shadow-2xl shadow-black/30">
          <div className="flex h-10 items-center gap-1.5 border-b border-white/10 px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <div className="mx-auto h-5 w-2/5 rounded-md border border-white/10 bg-white/[0.04]" />
          </div>
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={`${project.title} preview`} className="block aspect-video w-full object-cover" />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-950 text-sky-300">No preview image yet.</div>
          )}
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">Overview</p>
            <p className="mt-5 text-base leading-8 text-slate-300">{project.description}</p>
          </article>

          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">Technology</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag : string) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">{tag}</span>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-10 md:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">Engineering focus</p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p><strong className="text-white">Product thinking:</strong> the project is presented around a clear user experience and practical workflow.</p>
              <p><strong className="text-white">Full-stack delivery:</strong> the technology stack covers the application layers represented by this build.</p>
              <p><strong className="text-white">Maintainability:</strong> the portfolio emphasizes reusable UI, structured data and production-minded implementation.</p>
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">Highlights</p>
            <div className="mt-6 space-y-3">
              {tags.slice(0, 6).map((tag : string) => (
                <div key={tag} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-400" />
                  {tag} integration or implementation
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-400" />
                Responsive product-focused interface
              </div>
            </div>
          </article>
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-8">
          <Link href="/#work" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Explore more work
          </Link>
          <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200">
            Discuss a project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
