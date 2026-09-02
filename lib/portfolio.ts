import { prisma } from "@/lib/db";

export async function getPortfolioData() {
  const [
    profile,
    skills,
    projects,
    experience,
  ] = await Promise.all([
    prisma.profile.findFirst(),

    prisma.skill.findMany({
      orderBy: {
        order: "asc",
      },
    }),

    prisma.project.findMany({
      where: {
        status: "active",
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),

    prisma.experience.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    profile,
    skills,
    projects,
    experience,
  };
}