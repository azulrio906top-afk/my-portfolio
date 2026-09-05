import { prisma } from "@/lib/db";

async function main(): Promise<void> {
    const [projects, skills] = await Promise.all([
        prisma.project.findMany({
            include: {
                projectSkills: true,
            },
        }),
        prisma.skill.findMany(),
    ]);

    let linked = 0;

    for (const project of projects) {
        if (project.projectSkills.length > 0) {
            continue;
        }

        const tags = project.tags
            .split(",")
            .map((tag: string) => tag.trim().toLowerCase())
            .filter(Boolean);

        const matches = skills.filter((skill: typeof skills[number]) =>
            tags.includes(skill.name.trim().toLowerCase())
        );

        if (matches.length === 0) {
            continue;
        }

        await prisma.projectSkill.createMany({
            data: matches.map((skill: typeof skills[number]) => ({
                projectId: project.id,
                skillId: skill.id,
            })),
            skipDuplicates: true,
        });

        linked += matches.length;
    }

    console.log(`Linked ${linked} project skills.`);
}

main()
    .catch((error: unknown) => {
        console.error("Failed to link project skills:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });