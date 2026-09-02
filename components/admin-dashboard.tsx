'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, PencilLine, Trash2 } from 'lucide-react';

type Skill = {
  id: number;
  name: string;
  category: string;
  order: number;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  status: string;
  summary: string;
  url?: string | null;
  githubUrl?: string | null;
  imageUrl?: string | null;
  tags: string;
  featured: boolean;
  description: string;
};

type AdminDashboardProps = {
  skills: Skill[];
  projects: Project[];
  createSkillAction: (formData: FormData) => Promise<unknown>;
  updateSkillAction: (formData: FormData) => Promise<unknown>;
  deleteSkillAction: (formData: FormData) => Promise<unknown>;
  createProjectAction: (formData: FormData) => Promise<unknown>;
  updateProjectAction: (formData: FormData) => Promise<unknown>;
  deleteProjectAction: (formData: FormData) => Promise<unknown>;
};

export function AdminDashboard({
  skills,
  projects,
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
}: AdminDashboardProps) {
  const router = useRouter();
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function runAction(
    action: (formData: FormData) => Promise<unknown>,
    formData: FormData,
    successText: string,
  ) {
    try {
      await action(formData);
      setNotice({ type: 'success', text: successText });
      router.refresh();
    } catch (error) {
      setNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  }

  const shellClass = 'min-h-screen px-6 py-12 transition-colors duration-200';
  const panelClass = 'rounded-3xl border p-6 shadow-lg shadow-slate-900/5';
  const cardClass = 'rounded-2xl border p-3';
  const inputClass = 'rounded-xl border px-3 py-2 text-sm';
  const iconButtonClass = 'inline-flex h-9 w-9 items-center justify-center rounded-xl border transition';

  return (
    <main className={`${shellClass} bg-[var(--background)] text-[var(--foreground)]`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 text-[var(--foreground)] shadow-lg shadow-slate-900/5">
          {notice ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                notice.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                  : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200'
              }`}
            >
              {notice.text}
            </div>
          ) : null}
        </div>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className={`${panelClass} border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)]`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-sky-500">Content</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">Skills</h2>
              </div>
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-500">
                {skills.length} items
              </span>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                void runAction(createSkillAction, formData, 'Skill created successfully.');
              }}
              className="mb-6 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_6rem_auto] xl:items-center">
                <input name="name" placeholder="Skill name" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)] sm:col-span-1`} required />
                <input name="category" placeholder="Category" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)] sm:col-span-1`} required />
                <input name="order" type="number" min="0" defaultValue={0} className={`${inputClass} w-24 max-w-full border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)] sm:col-span-1 xl:col-span-1`} />
                <button type="submit" className={`${iconButtonClass} border-sky-500/40 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 sm:justify-self-end xl:justify-self-auto`} aria-label="Create skill">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {skills.length === 0 ? (
                <div className={`${cardClass} border border-dashed border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)]`}>
                  No skills yet. Add your first skill using the form above.
                </div>
              ) : (
                skills.map((skill) => (
                  <div key={skill.id} className={`${cardClass} border border-[var(--border)] bg-[var(--surface)]`}>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const form = event.currentTarget;
                        const formData = new FormData(form);
                        void runAction(updateSkillAction, formData, `${skill.name} updated.`);
                      }}
                      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_6rem_auto] xl:items-center"
                    >
                      <input type="hidden" name="id" value={skill.id} />
                      <input name="name" defaultValue={skill.name} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] sm:col-span-1`} required />
                      <input name="category" defaultValue={skill.category} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] sm:col-span-1`} required />
                      <input name="order" type="number" min="0" defaultValue={skill.order} className={`${inputClass} w-24 max-w-full border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] sm:col-span-1 xl:col-span-1`} />
                      <div className="flex gap-2 sm:col-span-2 xl:col-span-1 xl:justify-end">
                        <button type="submit" className={`${iconButtonClass} border-sky-500/40 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20`} aria-label={`Update skill ${skill.name}`}>
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            const form = event.currentTarget.form;
                            if (!form) return;
                            const formData = new FormData(form);
                            void runAction(deleteSkillAction, formData, `${skill.name} deleted.`);
                          }}
                          className={`${iconButtonClass} border-slate-700/80 bg-slate-900/60 text-slate-300 hover:bg-slate-800`}
                          aria-label={`Delete skill ${skill.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${panelClass} border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)]`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-sky-500">Portfolio</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">Projects</h2>
              </div>
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-500">
                {projects.length} items
              </span>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                void runAction(createProjectAction, formData, 'Project created successfully.');
              }}
              className="mb-6 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <input name="title" placeholder="Project title" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)]`} required />
                <input name="slug" placeholder="slug" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)]`} required />
                <input name="url" placeholder="Project URL" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)]`} />
                <input name="githubUrl" placeholder="GitHub URL" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)]`} />
                <input name="imageUrl" placeholder="Image URL" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)] md:col-span-2`} />
                <input name="tags" placeholder="tags, comma separated" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)] md:col-span-2`} />
                <input name="status" placeholder="Status" defaultValue="active" className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)]`} />
                <label className={`flex items-center gap-2 rounded-xl border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]`}>
                  <input name="featured" type="checkbox" className="h-4 w-4 accent-sky-500" />
                  Featured
                </label>
              </div>
              <div className="flex justify-end">
                <button type="submit" className={`${iconButtonClass} border-sky-500/40 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20`} aria-label="Create project">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <textarea name="summary" placeholder="Short summary" rows={2} className={`w-full rounded-xl border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]`} required />
              <textarea name="description" placeholder="Full description" rows={3} className={`w-full rounded-xl border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]`} required />
            </form>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className={`${cardClass} border border-dashed border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)]`}>
                  No projects yet. Add your first project using the form above.
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className={`${cardClass} border border-[var(--border)] bg-[var(--surface)]`}>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const form = event.currentTarget;
                        const formData = new FormData(form);
                        void runAction(updateProjectAction, formData, `${project.title} updated.`);
                      }}
                      className="space-y-3"
                    >
                      <input type="hidden" name="id" value={project.id} />
                      <div className="grid gap-3 md:grid-cols-2">
                        <input name="title" defaultValue={project.title} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)]`} required />
                        <input name="slug" defaultValue={project.slug} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)]`} required />
                        <input name="url" defaultValue={project.url ?? ''} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)]`} />
                        <input name="githubUrl" defaultValue={project.githubUrl ?? ''} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)]`} />
                        <input name="imageUrl" defaultValue={project.imageUrl ?? ''} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] md:col-span-2`} />
                        <input name="tags" defaultValue={project.tags} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)] md:col-span-2`} />
                        <input name="status" defaultValue={project.status} className={`${inputClass} border-[var(--input-border)] bg-[var(--input)] text-[var(--foreground)]`} />
                        <label className={`flex items-center gap-2 rounded-xl border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]`}>
                          <input name="featured" type="checkbox" defaultChecked={project.featured} className="h-4 w-4 accent-sky-500" />
                          Featured
                        </label>
                      </div>
                      <textarea name="summary" defaultValue={project.summary} rows={2} className={`w-full rounded-xl border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]`} required />
                      <textarea name="description" defaultValue={project.description} rows={3} className={`w-full rounded-xl border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]`} required />
                      <div className="flex justify-end gap-2">
                        <button type="submit" className={`${iconButtonClass} border-sky-500/40 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20`} aria-label={`Update project ${project.title}`}>
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            const form = event.currentTarget.form;
                            if (!form) return;
                            const formData = new FormData(form);
                            void runAction(deleteProjectAction, formData, `${project.title} deleted.`);
                          }}
                          className={`${iconButtonClass} border-slate-700/80 bg-slate-900/60 text-slate-300 hover:bg-slate-800`}
                          aria-label={`Delete project ${project.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
