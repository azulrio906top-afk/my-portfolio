import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    profileUpdateSchema,
} from "@/lib/admin-validation";

export async function GET() {
    try {
        const authResult =
            await requireAdmin();

        if (!authResult.authorized) {
            return apiError(
                authResult.error,
                authResult.status,
            );
        }

        const profile =
            await prisma.profile.findFirst({
                orderBy: {
                    id: "asc",
                },
            });

        if (!profile) {
            return apiError(
                "Profile not found.",
                404,
            );
        }

        return apiSuccess(profile);
    } catch (error) {
        console.error(
            "GET /api/admin/profile:",
            error,
        );

        return apiError(
            "Failed to load profile.",
        );
    }
}

export async function PUT(
    request: Request,
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

        const body = await request.json();

        const parsed =
            profileUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid profile data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing =
            await prisma.profile.findFirst({
                orderBy: {
                    id: "asc",
                },
            });

        if (!existing) {
            const profile =
                await prisma.profile.create({
                    data: parsed.data,
                });

            return apiSuccess(
                profile,
                201,
            );
        }

        const profile =
            await prisma.profile.update({
                where: {
                    id: existing.id,
                },
                data: parsed.data,
            });

        return apiSuccess(profile);
    } catch (error) {
        console.error(
            "PUT /api/admin/profile:",
            error,
        );

        return apiError(
            "Failed to update profile.",
        );
    }
}