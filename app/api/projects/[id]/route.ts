import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    projectUpdateSchema,
} from "@/lib/admin-validation";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function parseId(value: string) {
    const id = Number(value);

    return Number.isSafeInteger(id) &&
        id > 0
        ? id
        : null;
}

export async function GET(
    _request: Request,
    context: RouteContext,
) {
    try {
        const authResult =
            await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const { id: rawId } =
            await context.params;

        const id = parseId(rawId);

        if (!id) {
            return apiError(
                "Invalid project ID.",
                400,
            );
        }

        const project =
            await prisma.project.findUnique({
                where: { id },
            });

        if (!project) {
            return apiError(
                "Project not found.",
                404,
            );
        }

        return apiSuccess(project);
    } catch (error) {
        console.error(
            "GET /api/admin/projects/[id]:",
            error,
        );

        return apiError(
            "Failed to load project.",
        );
    }
}

export async function PATCH(
    request: Request,
    context: RouteContext,
) {
    try {
        const authResult =
            await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const { id: rawId } =
            await context.params;

        const id = parseId(rawId);

        if (!id) {
            return apiError(
                "Invalid project ID.",
                400,
            );
        }

        const body = await request.json();

        const parsed =
            projectUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid project data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing =
            await prisma.project.findUnique({
                where: { id },
            });

        if (!existing) {
            return apiError(
                "Project not found.",
                404,
            );
        }

        if (parsed.data.slug) {
            const duplicate =
                await prisma.project.findFirst({
                    where: {
                        slug: parsed.data.slug,
                        NOT: { id },
                    },
                });

            if (duplicate) {
                return apiError(
                    "A project with this slug already exists.",
                    409,
                );
            }
        }

        const project =
            await prisma.project.update({
                where: { id },
                data: parsed.data,
            });

        return apiSuccess(project);
    } catch (error) {
        console.error(
            "PATCH /api/admin/projects/[id]:",
            error,
        );

        return apiError(
            "Failed to update project.",
        );
    }
}

export async function DELETE(
    _request: Request,
    context: RouteContext,
) {
    try {
        const authResult =
            await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const { id: rawId } =
            await context.params;

        const id = parseId(rawId);

        if (!id) {
            return apiError(
                "Invalid project ID.",
                400,
            );
        }

        const existing =
            await prisma.project.findUnique({
                where: { id },
            });

        if (!existing) {
            return apiError(
                "Project not found.",
                404,
            );
        }

        await prisma.project.delete({
            where: { id },
        });

        return apiSuccess({
            id,
            deleted: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/admin/projects/[id]:",
            error,
        );

        return apiError(
            "Failed to delete project.",
        );
    }
}