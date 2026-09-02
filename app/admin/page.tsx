import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createProject, createSkill, deleteProject, deleteSkill, updateProject, updateSkill } from './actions';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const [skills, projects] = await Promise.all([
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-50">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-sky-300">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Portfolio control center</h1>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Sign out
            </button>
          </form>
        </header>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Skills</h2>
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-200">
                {skills.length} items
              </span>
            </div>

            <form action={createSkill} className="mb-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input name="name" placeholder="Skill name" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" required />
                <input name="category" placeholder="Category" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" required />
                <input name="order" type="number" min="0" defaultValue={0} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
              </div>
              <button type="submit" className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400">
                Add skill
              </button>
            </form>

            <div className="space-y-3">
              {skills.map((skill: { id: number; name: string; category: string; order: number }) => (
                <div key={skill.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <form action={updateSkill} className="grid gap-3 md:grid-cols-[1.2fr_1fr_0.5fr_auto] md:items-center">
                    <input type="hidden" name="id" value={skill.id} />
                    <input name="name" defaultValue={skill.name} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" required />
                    <input name="category" defaultValue={skill.category} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" required />
                    <input name="order" type="number" min="0" defaultValue={skill.order} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                    <div className="flex gap-2 md:justify-end">
                      <button type="submit" className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">
                        Save
                      </button>
                      <button
                        type="submit"
                        formAction={deleteSkill}
                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Projects</h2>
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-200">
                {projects.length} items
              </span>
            </div>

            <form action={createProject} className="mb-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input name="title" placeholder="Project title" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" required />
                <input name="slug" placeholder="slug" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" required />
                <input name="url" placeholder="Project URL" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <input name="githubUrl" placeholder="GitHub URL" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <input name="imageUrl" placeholder="Image URL" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 md:col-span-2" />
                <input name="tags" placeholder="tags, comma separated" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 md:col-span-2" />
                <input name="status" placeholder="Status" defaultValue="active" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                  <input name="featured" type="checkbox" className="h-4 w-4 accent-sky-500" />
                  Featured
                </label>
              </div>
              <textarea name="summary" placeholder="Short summary" rows={2} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" required />
              <textarea name="description" placeholder="Full description" rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" required />
              <button type="submit" className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400">
                Add project
              </button>
            </form>

            <div className="space-y-3">
              {projects.map((project: { id: number; title: string; slug: string; status: string; summary: string; url?: string | null; githubUrl?: string | null; imageUrl?: string | null; tags: string; featured: boolean; description: string }) => (
                <div key={project.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <form action={updateProject} className="space-y-3">
                    <input type="hidden" name="id" value={project.id} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <input name="title" defaultValue={project.title} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" required />
                      <input name="slug" defaultValue={project.slug} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" required />
                      <input name="url" defaultValue={project.url ?? ''} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                      <input name="githubUrl" defaultValue={project.githubUrl ?? ''} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                      <input name="imageUrl" defaultValue={project.imageUrl ?? ''} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white md:col-span-2" />
                      <input name="tags" defaultValue={project.tags} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white md:col-span-2" />
                      <input name="status" defaultValue={project.status} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                      <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                        <input name="featured" type="checkbox" defaultChecked={project.featured} className="h-4 w-4 accent-sky-500" />
                        Featured
                      </label>
                    </div>
                    <textarea name="summary" defaultValue={project.summary} rows={2} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" required />
                    <textarea name="description" defaultValue={project.description} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" required />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">
                        Save
                      </button>
                      <button
                        type="submit"
                        formAction={deleteProject}
                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
