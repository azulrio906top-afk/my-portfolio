import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    skillCreateSchema,
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

        const skills =
            await prisma.skill.findMany({
                orderBy: [
                    {
                        order: "asc",
                    },
                    {
                        name: "asc",
                    },
                ],
            });

        return apiSuccess(skills);
    } catch (error) {
        console.error(
            "GET /api/admin/skills:",
            error,
        );

        return apiError(
            "Failed to load skills.",
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
            skillCreateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid skill data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing =
            await prisma.skill.findUnique({
                where: {
                    name: parsed.data.name,
                },
            });

        if (existing) {
            return apiError(
                "A skill with this name already exists.",
                409,
            );
        }

        const skill =
            await prisma.skill.create({
                data: parsed.data,
            });

        return apiSuccess(skill, 201);
    } catch (error) {
        console.error(
            "POST /api/admin/skills:",
            error,
        );

        return apiError(
            "Failed to create skill.",
        );
    }
}