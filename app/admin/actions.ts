"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { auth } from "@/auth";
import { ensureDatabase, prisma } from "@/lib/db";

/* ============================================================
   TYPES
============================================================ */

export type ActionResult = {
    success: boolean;
    error?: string;
};

/* ============================================================
   AUTHORIZATION
============================================================ */

async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const role =
        "role" in session.user &&
        typeof session.user.role === "string"
            ? session.user.role
            : undefined;

    if (role !== "admin") {
        throw new Error("Forbidden");
    }

    await ensureDatabase();

    return session;
}

/* ============================================================
   HELPERS
============================================================ */

function text(
    formData: FormData,
    key: string,
): string {
    return String(formData.get(key) ?? "").trim();
}

function nullableText(
    formData: FormData,
    key: string,
): string | null {
    const value = text(formData, key);

    return value || null;
}

function integer(
    formData: FormData,
    key: string,
): number | null {
    const value = Number(formData.get(key));

    if (!Number.isInteger(value) || value <= 0) {
        return null;
    }

    return value;
}

function orderValue(
    formData: FormData,
): number {
    const value = Number(
        formData.get("order") ?? 0,
    );

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.trunc(value);
}

function checked(
    formData: FormData,
    key: string,
): boolean {
    const value = formData.get(key);

    return (
        value === "on" ||
        value === "true" ||
        value === "1"
    );
}

function revalidatePortfolio(): void {
    revalidatePath("/admin");
    revalidatePath("/");
}

function errorMessage(error: unknown): string {
    if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
    ) {
        switch (error.code) {
            case "P2002":
                return "A record with that unique value already exists.";

            case "P2025":
                return "The requested record was not found.";

            case "P2003":
                return "This record cannot be changed because another record depends on it.";

            default:
                return "The database operation failed.";
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong.";
}

/* ============================================================
   SKILLS
============================================================ */

export async function createSkill(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const name = text(formData, "name");
    const category = text(formData, "category");
    const order = orderValue(formData);

    if (!name) {
        return {
            success: false,
            error: "Skill name is required.",
        };
    }

    if (!category) {
        return {
            success: false,
            error: "Skill category is required.",
        };
    }

    try {
        await prisma.skill.create({
            data: {
                name,
                category,
                order,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("createSkill:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

export async function updateSkill(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");
    const name = text(formData, "name");
    const category = text(formData, "category");
    const order = orderValue(formData);

    if (!id) {
        return {
            success: false,
            error: "Invalid skill ID.",
        };
    }

    if (!name) {
        return {
            success: false,
            error: "Skill name is required.",
        };
    }

    if (!category) {
        return {
            success: false,
            error: "Skill category is required.",
        };
    }

    try {
        await prisma.skill.update({
            where: {
                id,
            },
            data: {
                name,
                category,
                order,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("updateSkill:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

export async function deleteSkill(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");

    if (!id) {
        return {
            success: false,
            error: "Invalid skill ID.",
        };
    }

    try {
        await prisma.skill.delete({
            where: {
                id,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("deleteSkill:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

/* ============================================================
   PROJECTS
============================================================ */

export async function createProject(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const title = text(formData, "title");
    const slug = text(formData, "slug");
    const summary = text(formData, "summary");
    const description = text(
        formData,
        "description",
    );

    const url = nullableText(formData, "url");
    const githubUrl = nullableText(
        formData,
        "githubUrl",
    );
    const imageUrl = nullableText(
        formData,
        "imageUrl",
    );

    const tags = text(formData, "tags");
    const skillIds = Array.from(new Set(formData.getAll("skillIds")
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)));

    const featured = checked(
        formData,
        "featured",
    );

    const requestedStatus =
        text(formData, "status") || "active";

    // `featured` is a presentation flag, not a project lifecycle status.
    // Older records may contain `status: "featured"`; normalize those
    // records so toggling Featured never leaves an invalid/stale status.
    const status =
        requestedStatus.toLowerCase() === "featured"
            ? "active"
            : requestedStatus;

    if (!title) {
        return {
            success: false,
            error: "Project title is required.",
        };
    }

    if (!slug) {
        return {
            success: false,
            error: "Project slug is required.",
        };
    }

    if (!summary) {
        return {
            success: false,
            error: "Project summary is required.",
        };
    }

    if (!description) {
        return {
            success: false,
            error:
                "Project description is required.",
        };
    }

    try {
        await prisma.project.create({
            data: {
                title,
                slug,
                summary,
                description,
                url,
                githubUrl,
                imageUrl,
                tags,
                featured,
                status,
                projectSkills: {
                    create: skillIds.map((skillId) => ({
                        skill: { connect: { id: skillId } },
                    })),
                },
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("createProject:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

export async function updateProject(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");

    const title = text(formData, "title");
    const slug = text(formData, "slug");
    const summary = text(formData, "summary");
    const description = text(
        formData,
        "description",
    );

    const url = nullableText(formData, "url");
    const githubUrl = nullableText(
        formData,
        "githubUrl",
    );
    const imageUrl = nullableText(
        formData,
        "imageUrl",
    );

    const tags = text(formData, "tags");
    const skillIds = Array.from(new Set(formData.getAll("skillIds")
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)));

    const featured = checked(
        formData,
        "featured",
    );

    const requestedStatus =
        text(formData, "status") || "active";

    // `featured` is a presentation flag, not a project lifecycle status.
    // Older records may contain `status: "featured"`; normalize those
    // records so toggling Featured never leaves an invalid/stale status.
    const status =
        requestedStatus.toLowerCase() === "featured"
            ? "active"
            : requestedStatus;

    if (!id) {
        return {
            success: false,
            error: "Invalid project ID.",
        };
    }

    if (!title) {
        return {
            success: false,
            error: "Project title is required.",
        };
    }

    if (!slug) {
        return {
            success: false,
            error: "Project slug is required.",
        };
    }

    if (!summary) {
        return {
            success: false,
            error: "Project summary is required.",
        };
    }

    if (!description) {
        return {
            success: false,
            error:
                "Project description is required.",
        };
    }
``
    try {
        // There should be exactly one featured build on the public portfolio.
        // Clear the previous featured flag first, then save the selected project.
        // This keeps the admin toggle and public featured card in sync.
        await prisma.$transaction(async (tx) => {
            if (featured) {
                await tx.project.updateMany({
                    where: {
                        id: {
                            not: id,
                        },
                        featured: true,
                    },
                    data: {
                        featured: false,
                    },
                });
            }

            await tx.project.update({
                where: {
                    id,
                },
                data: {
                    title,
                    slug,
                    summary,
                    description,
                    url,
                    githubUrl,
                    imageUrl,
                    tags,
                    featured,
                    // Featured is a presentation flag; the lifecycle status
                    // remains `active` when a project is featured.
                    status: featured ? "active" : status,
                    projectSkills: {
                        deleteMany: {},
                        create: skillIds.map((skillId) => ({
                            skill: { connect: { id: skillId } },
                        })),
                    },
                },
            });
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("updateProject:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

export async function deleteProject(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");

    if (!id) {
        return {
            success: false,
            error: "Invalid project ID.",
        };
    }

    try {
        await prisma.project.delete({
            where: {
                id,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("deleteProject:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

/* ============================================================
   PROFILE
============================================================ */

export async function updateProfile(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");

    const name = text(formData, "name");
    const headline = text(
        formData,
        "headline",
    );
    const bio = text(formData, "bio");

    const location = nullableText(
        formData,
        "location",
    );

    const email = nullableText(
        formData,
        "email",
    );

    const website = nullableText(
        formData,
        "website",
    );

    const github = nullableText(
        formData,
        "github",
    );

    const linkedin = nullableText(
        formData,
        "linkedin",
    );

    const avatarUrl = nullableText(
        formData,
        "avatarUrl",
    );

    if (!name) {
        return {
            success: false,
            error: "Name is required.",
        };
    }

    if (!headline) {
        return {
            success: false,
            error: "Headline is required.",
        };
    }

    if (!bio) {
        return {
            success: false,
            error: "Bio is required.",
        };
    }

    try {
        const data = {
            name,
            headline,
            bio,
            location,
            email,
            website,
            github,
            linkedin,
            avatarUrl,
        };

        if (id) {
            await prisma.profile.update({
                where: {
                    id,
                },
                data,
            });
        } else {
            await prisma.profile.create({
                data,
            });
        }

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error("updateProfile:", error);

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

/* ============================================================
   EXPERIENCE
============================================================ */

/**
 * IMPORTANT:
 *
 * Experience uses:
 *
 * name
 * company
 * position
 * location
 * startDate
 * endDate
 * description
 *
 * startDate/endDate are strings.
 *
 * There is NO technologies field.
 * There is NO current field.
 */
export async function createExperience(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const name = text(
        formData,
        "name",
    );

    const company = text(
        formData,
        "company",
    );

    const position = text(
        formData,
        "position",
    );

    const location = nullableText(
        formData,
        "location",
    );

    const startDate = text(
        formData,
        "startDate",
    );

    const endDate = nullableText(
        formData,
        "endDate",
    );

    const description = text(
        formData,
        "description",
    );

    if (!name) {
        return {
            success: false,
            error: "Experience name is required.",
        };
    }

    if (!company) {
        return {
            success: false,
            error: "Company is required.",
        };
    }

    if (!position) {
        return {
            success: false,
            error: "Position is required.",
        };
    }

    if (!startDate) {
        return {
            success: false,
            error: "Start date is required.",
        };
    }

    if (!description) {
        return {
            success: false,
            error:
                "Experience description is required.",
        };
    }

    try {
        await prisma.experience.create({
            data: {
                name,
                company,
                position,
                location,
                startDate,
                endDate,
                description,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "createExperience:",
            error,
        );

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

export async function updateExperience(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");

    const name = text(
        formData,
        "name",
    );

    const company = text(
        formData,
        "company",
    );

    const position = text(
        formData,
        "position",
    );

    const location = nullableText(
        formData,
        "location",
    );

    const startDate = text(
        formData,
        "startDate",
    );

    const endDate = nullableText(
        formData,
        "endDate",
    );

    const description = text(
        formData,
        "description",
    );

    if (!id) {
        return {
            success: false,
            error: "Invalid experience ID.",
        };
    }

    if (!name) {
        return {
            success: false,
            error: "Experience name is required.",
        };
    }

    if (!company) {
        return {
            success: false,
            error: "Company is required.",
        };
    }

    if (!position) {
        return {
            success: false,
            error: "Position is required.",
        };
    }

    if (!startDate) {
        return {
            success: false,
            error: "Start date is required.",
        };
    }

    if (!description) {
        return {
            success: false,
            error:
                "Experience description is required.",
        };
    }

    try {
        await prisma.experience.update({
            where: {
                id,
            },
            data: {
                name,
                company,
                position,
                location,
                startDate,
                endDate,
                description,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "updateExperience:",
            error,
        );

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}

export async function deleteExperience(
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();

    const id = integer(formData, "id");

    if (!id) {
        return {
            success: false,
            error: "Invalid experience ID.",
        };
    }

    try {
        await prisma.experience.delete({
            where: {
                id,
            },
        });

        revalidatePortfolio();

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "deleteExperience:",
            error,
        );

        return {
            success: false,
            error: errorMessage(error),
        };
    }
}