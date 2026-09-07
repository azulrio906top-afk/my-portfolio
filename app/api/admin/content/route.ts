import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return apiError(authResult.error, authResult.status);
  const content = await prisma.siteContent.findFirst();
  return apiSuccess(content);
}

export async function PUT(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (!authResult.authorized) return apiError(authResult.error, authResult.status);
    const body = await request.json();
    const allowed = {
      heroBadge: body.heroBadge ?? null, heroTitle: body.heroTitle ?? null, heroDescription: body.heroDescription ?? null,
      aboutTitle: body.aboutTitle ?? null, aboutText: body.aboutText ?? null, services: body.services ?? null,
      whyTitle: body.whyTitle ?? null, whyItems: body.whyItems ?? null, ctaTitle: body.ctaTitle ?? null,
      ctaDescription: body.ctaDescription ?? null, ctaPrimaryText: body.ctaPrimaryText ?? null, ctaSecondaryText: body.ctaSecondaryText ?? null,
    };
    const existing = await prisma.siteContent.findFirst();
    const content = existing
      ? await prisma.siteContent.update({ where: { id: existing.id }, data: allowed })
      : await prisma.siteContent.create({ data: allowed });
    return apiSuccess(content);
  } catch (error) {
    console.error("PUT /api/admin/content:", error);
    return apiError("Failed to save homepage content.");
  }
}
