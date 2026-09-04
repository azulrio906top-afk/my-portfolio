import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { ensureDatabase, prisma } from "@/lib/db";

import { AdminDashboard } from "@/components/admin-dashboard";

import {
    createExperience,
    createProject,
    createSkill,
    deleteExperience,
    deleteProject,
    deleteSkill,
    updateExperience,
    updateProfile,
    updateProject,
    updateSkill,
} from "./actions";

type AdminSkill = {
    id: number;
    name: string;
    category: string;
    order: number;
};

type AdminProjectSkill = {
    id: number;
    name: string;
    category: string;
};

type AdminProject = {
    id: number;
    title: string;
    slug: string;
    status: string;
    summary: string;
    description: string;
    url: string | null;
    githubUrl: string | null;
    imageUrl: string | null;
    tags: string;
    featured: boolean;
    skills: AdminProjectSkill[];
};

function isMissingTableError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2021"
    );
}

async function loadProfile() {
    try {
        return await prisma.profile.findFirst({
            orderBy: {
                id: "asc",
            },
        });
    } catch (error) {
        if (isMissingTableError(error)) {
            return null;
        }

        throw error;
    }
}

async function loadSkills(): Promise<AdminSkill[]> {
    try {
        return await prisma.skill.findMany({
            orderBy: {
                order: "asc",
            },
        });
    } catch (error) {
        if (isMissingTableError(error)) {
            return [];
        }

        throw error;
    }
}


type ProjectSkillRow = {
    id: number;
    name: string;
    category: string;
};

type ProjectRow = {
    id: number;
    title: string;
    slug: string;
    status: string;
    summary: string;
    description: string;
    url: string | null;
    githubUrl: string | null;
    imageUrl: string | null;
    tags: string;
    featured: boolean;
    projectSkills: Array<{
        skill: ProjectSkillRow;
    }>;
};

async function loadProjects(): Promise<AdminProject[]> {
    try {
        const rows =
            (await prisma.project.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    projectSkills: {
                        include: {
                            skill: true,
                        },
                    },
                },
            })) as ProjectRow[];

        return rows.map(
            (project: ProjectRow): AdminProject => ({
                id: project.id,
                title: project.title,
                slug: project.slug,
                status: project.status,
                summary: project.summary,
                description: project.description,
                url: project.url,
                githubUrl: project.githubUrl,
                imageUrl: project.imageUrl,
                tags: project.tags,
                featured: project.featured,

                skills: project.projectSkills.map(
                    ({
                        skill,
                    }: {
                        skill: ProjectSkillRow;
                    }): AdminProjectSkill => ({
                        id: skill.id,
                        name: skill.name,
                        category: skill.category,
                    })
                ),
            })
        );
    } catch (error) {
        if (isMissingTableError(error)) {
            return [];
        }

        throw error;
    }
}

async function loadExperience() {
    try {
        return await prisma.experience.findMany({
            orderBy: {
                startDate: "desc",
            },
        });
    } catch (error) {
        if (isMissingTableError(error)) {
            return [];
        }

        throw error;
    }
}

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/admin/login");
    }

    await ensureDatabase();

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
        <main className="min-h-screen bg-slate-50">
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
                createExperienceAction={
                    createExperience
                }
                updateExperienceAction={
                    updateExperience
                }
                deleteExperienceAction={
                    deleteExperience
                }
            />
        </main>
    );
}