import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    projectCreateSchema,
    projectUpdateSchema,
} from "@/lib/admin-validation";

function getSkillIds(value: unknown): number[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return Array.from(
        new Set(
            value
                .map((item: unknown) => Number(item))
                .filter(
                    (item: number): item is number =>
                        Number.isInteger(item) && item > 0,
                ),
        ),
    );
}

export async function GET() {
    try {
        const authResult = await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const projects = await prisma.project.findMany({
            orderBy: [
                {
                    featured: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
            include: {
                projectSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });

        return apiSuccess(projects);
    } catch (error) {
        console.error(
            "GET /api/admin/projects:",
            error,
        );

        return apiError(
            "Failed to load projects.",
        );
    }
}

export async function POST(request: Request) {
    try {
        const authResult = await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const body: unknown = await request.json();

        const parsed = projectCreateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid project data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing = await prisma.project.findUnique({
            where: {
                slug: parsed.data.slug,
            },
        });

        if (existing) {
            return apiError(
                "A project with this slug already exists.",
                409,
            );
        }

        const skillIds = getSkillIds(
            typeof body === "object" &&
                body !== null &&
                "skillIds" in body
                ? (body as { skillIds?: unknown }).skillIds
                : undefined,
        );

        const data = {
            ...parsed.data,
            projectSkills: {
                create: skillIds.map((skillId) => ({
                    skill: {
                        connect: {
                            id: skillId,
                        },
                    },
                })),
            },
            status:
                parsed.data.status?.toLowerCase() === "featured"
                    ? "active"
                    : parsed.data.status ?? "active",
        };

        const project = await prisma.project.create({
            data,
        });

        return apiSuccess(project, 201);
    } catch (error) {
        console.error(
            "POST /api/admin/projects:",
            error,
        );

        return apiError(
            "Failed to create project.",
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const authResult = await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const body: unknown = await request.json();

        const id = Number(
            typeof body === "object" &&
                body !== null &&
                "id" in body
                ? (body as { id?: unknown }).id
                : undefined,
        );

        if (!Number.isInteger(id) || id <= 0) {
            return apiError(
                "Invalid project ID.",
                400,
            );
        }

        const parsed = projectUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid project data.",
                400,
                parsed.error.flatten(),
            );
        }

        const skillIds = getSkillIds(
            typeof body === "object" &&
                body !== null &&
                "skillIds" in body
                ? (body as { skillIds?: unknown }).skillIds
                : undefined,
        );

        const data = {
            ...parsed.data,
            projectSkills: {
                deleteMany: {},
                create: skillIds.map((skillId) => ({
                    skill: {
                        connect: {
                            id: skillId,
                        },
                    },
                })),
            },
            status: parsed.data.featured
                ? "active"
                : parsed.data.status?.toLowerCase() === "featured"
                    ? "active"
                    : parsed.data.status,
        };

        const project = await prisma.$transaction(
            async (tx) => {
                if (data.featured === true) {
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

                return tx.project.update({
                    where: {
                        id,
                    },
                    data,
                });
            },
        );

        return apiSuccess(project);
    } catch (error) {
        console.error(
            "PATCH /api/admin/projects:",
            error,
        );

        return apiError(
            "Failed to update project.",
        );
    }
}