import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ensureDatabase, prisma } from '@/lib/db';
import { SignOutButton } from '@/components/signout-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { AdminDashboard } from '@/components/admin-dashboard';
import {
    createProject,
    createSkill,
    deleteProject,
    deleteSkill,
    updateProject,
    updateSkill,
    updateProfile,
    createExperience,
    updateExperience,
    deleteExperience,
} from './actions';

function isMissingTableError(error: unknown) {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2021'
    );
}

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/admin/login');
    }

    await ensureDatabase();

    const loadProfile = async () => {
        try {
            return await prisma.profile.findFirst({
                orderBy: { id: 'asc' },
            });
        } catch (error) {
            if (isMissingTableError(error)) {
                return null;
            }

            throw error;
        }
    };

    const loadExperience = async () => {
        try {
            return await prisma.experience.findMany({
                orderBy: {
                    startDate: 'desc',
                },
            });
        } catch (error) {
            if (isMissingTableError(error)) {
                return [];
            }

            throw error;
        }
    };

    const loadSkills = async () => {
        try {
            return await prisma.skill.findMany({ orderBy: { order: 'asc' } });
        } catch (error) {
            if (isMissingTableError(error)) {
                return [] as Array<{ id: number; name: string; category: string; order: number }>;
            }
            throw error;
        }
    };

    const loadProjects = async () => {
        try {
            return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
        } catch (error) {
            if (isMissingTableError(error)) {
                return [] as Array<{ id: number; title: string; slug: string; status: string; summary: string; url?: string | null; githubUrl?: string | null; imageUrl?: string | null; tags: string; featured: boolean; description: string }>;
            }
            throw error;
        }
    };

    const [
        profile,
        skills,
        projects,
        experience,
    ] = await Promise.all([
        loadProfile(),
        loadSkills(),
        loadProjects(),
        loadExperience(),
    ]);

    return (
        <div className="mx-auto max-w-7xl">
            <header className="mb-10 flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 text-[var(--foreground)] shadow-lg shadow-slate-900/5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-sky-500">Admin</p>
                    <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Portfolio control center</h1>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle className="border-[var(--border)] bg-[var(--button)] text-[var(--foreground)] hover:bg-[var(--button-hover)]" />
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--button)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--button-hover)]"
                    >
                        Home
                    </a>
                    <SignOutButton className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--button)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--button-hover)]" />
                </div>
            </header>

            <AdminDashboard
                profile={profile}
                skills={skills}
                projects={projects}
                experience={experience}
                updateProfileAction={updateProfile}
                createSkillAction={createSkill}
                updateSkillAction={updateSkill}
                deleteSkillAction={deleteSkill}
                createProjectAction={createProject}
                updateProjectAction={updateProject}
                deleteProjectAction={deleteProject}
                createExperienceAction={createExperience}
                updateExperienceAction={updateExperience}
                deleteExperienceAction={deleteExperience}
            />
        </div>
    );
}
