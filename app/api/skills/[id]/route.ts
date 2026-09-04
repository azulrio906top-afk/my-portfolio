import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    skillUpdateSchema,
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
                "Invalid skill ID.",
                400,
            );
        }

        const skill =
            await prisma.skill.findUnique({
                where: { id },
            });

        if (!skill) {
            return apiError(
                "Skill not found.",
                404,
            );
        }

        return apiSuccess(skill);
    } catch (error) {
        console.error(
            "GET /api/admin/skills/[id]:",
            error,
        );

        return apiError(
            "Failed to load skill.",
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
                "Invalid skill ID.",
                400,
            );
        }

        const body = await request.json();

        const parsed =
            skillUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid skill data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing =
            await prisma.skill.findUnique({
                where: { id },
            });

        if (!existing) {
            return apiError(
                "Skill not found.",
                404,
            );
        }

        if (parsed.data.name) {
            const duplicate =
                await prisma.skill.findFirst({
                    where: {
                        name: parsed.data.name,
                        NOT: { id },
                    },
                });

            if (duplicate) {
                return apiError(
                    "A skill with this name already exists.",
                    409,
                );
            }
        }

        const skill =
            await prisma.skill.update({
                where: { id },
                data: parsed.data,
            });

        return apiSuccess(skill);
    } catch (error) {
        console.error(
            "PATCH /api/admin/skills/[id]:",
            error,
        );

        return apiError(
            "Failed to update skill.",
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
                "Invalid skill ID.",
                400,
            );
        }

        const existing =
            await prisma.skill.findUnique({
                where: { id },
            });

        if (!existing) {
            return apiError(
                "Skill not found.",
                404,
            );
        }

        await prisma.skill.delete({
            where: { id },
        });

        return apiSuccess({
            id,
            deleted: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/admin/skills/[id]:",
            error,
        );

        return apiError(
            "Failed to delete skill.",
        );
    }
}