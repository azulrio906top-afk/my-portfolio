import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    experienceCreateSchema,
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

        const experience =
            await prisma.experience.findMany({
                orderBy: [
                    {
                        current: "desc",
                    },
                    {
                        startDate: "desc",
                    },
                ],
            });

        return apiSuccess(experience);
    } catch (error) {
        console.error(
            "GET /api/admin/experience:",
            error,
        );

        return apiError(
            "Failed to load experience.",
        );
    }
}

export async function POST(
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
            experienceCreateSchema.safeParse(
                body,
            );

        if (!parsed.success) {
            return apiError(
                "Invalid experience data.",
                400,
                parsed.error.flatten(),
            );
        }

        /*
         * SQLite / Prisma:
         * startDate and endDate are Strings
         * in the current schema.
         */
        const experience =
            await prisma.experience.create({
                data: parsed.data,
            });

        return apiSuccess(
            experience,
            201,
        );
    } catch (error) {
        console.error(
            "POST /api/admin/experience:",
            error,
        );

        return apiError(
            "Failed to create experience.",
        );
    }
}