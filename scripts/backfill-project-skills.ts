import { prisma } from "@/lib/db";

async function main() {
  const [projects, skills] = await Promise.all([
    prisma.project.findMany({ include: { projectSkills: true } }),
    prisma.skill.findMany(),
  ]);

  let linked = 0;
  for (const project of projects) {
    if (project.projectSkills.length > 0) continue;
    const tags = project.tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    const matches = skills.filter((skill) => tags.includes(skill.name.trim().toLowerCase()));
    if (!matches.length) continue;
    await prisma.projectSkill.createMany({
      data: matches.map((skill) => ({ projectId: project.id, skillId: skill.id })),
      skipDuplicates: true,
    });
    linked += matches.length;
  }
  console.log(`Linked ${linked} project skills.`);
}

main().finally(() => prisma.$disconnect());
