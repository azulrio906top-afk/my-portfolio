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
        experiences,
    ] = await Promise.all([
        loadProfile(),
        loadSkills(),
        loadProjects(),
        loadExperience(),
    ]);

    return (
        <div className="mx-auto">
            <AdminDashboard
                profile={profile}
                skills={skills}
                projects={projects}
                experiences={experiences}
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
