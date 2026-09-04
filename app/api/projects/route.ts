import { prisma } from "@/lib/db";
import {
    apiError,
    apiSuccess,
} from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import {
    projectCreateSchema,
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

        const projects =
            await prisma.project.findMany({
                orderBy: [
                    {
                        featured: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
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
            projectCreateSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(
                "Invalid project data.",
                400,
                parsed.error.flatten(),
            );
        }

        const existing =
            await prisma.project.findUnique({
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

        const data = {
            ...parsed.data,
            status:
                parsed.data.status?.toLowerCase() === "featured"
                    ? "active"
                    : parsed.data.status ?? "active",
        };

        const project =
            await prisma.project.create({
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