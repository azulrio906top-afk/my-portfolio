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

async function loadSkills() {
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

async function loadProjects() {
    try {
        return await prisma.project.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                projectSkills: {
                    include: { skill: true },
                },
            },
        });
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
                projects={projects.map((project) => ({
                    ...project,
                    skills: project.projectSkills.map(({ skill }) => skill),
                }))}
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