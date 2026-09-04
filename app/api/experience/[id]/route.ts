import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    experienceUpdateSchema,
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
                "Invalid experience ID.",
                400,
            );
        }

        const experience =
            await prisma.experience.findUnique({
                where: { id },
            });

        if (!experience) {
            return apiError(
                "Experience not found.",
                404,
            );
        }

        return apiSuccess(experience);
    } catch (error) {
        console.error(
            "GET /api/admin/experience/[id]:",
            error,
        );

        return apiError(
            "Failed to load experience.",
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
                "Invalid experience ID.",
                400,
            );
        }

        const body = await request.json();

        const parsed =
            experienceUpdateSchema.safeParse(
                body,
            );

        if (!parsed.success) {
            return apiError(
                "Invalid experience data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing =
            await prisma.experience.findUnique({
                where: { id },
            });

        if (!existing) {
            return apiError(
                "Experience not found.",
                404,
            );
        }

        const experience =
            await prisma.experience.update({
                where: { id },
                data: parsed.data,
            });

        return apiSuccess(experience);
    } catch (error) {
        console.error(
            "PATCH /api/admin/experience/[id]:",
            error,
        );

        return apiError(
            "Failed to update experience.",
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
                "Invalid experience ID.",
                400,
            );
        }

        const existing =
            await prisma.experience.findUnique({
                where: { id },
            });

        if (!existing) {
            return apiError(
                "Experience not found.",
                404,
            );
        }

        await prisma.experience.delete({
            where: { id },
        });

        return apiSuccess({
            id,
            deleted: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/admin/experience/[id]:",
            error,
        );

        return apiError(
            "Failed to delete experience.",
        );
    }
}