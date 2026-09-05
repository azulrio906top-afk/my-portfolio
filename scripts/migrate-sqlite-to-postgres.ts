import { PrismaClient as SQLiteClient } from "../node_modules/.prisma/sqlite-client";
import { PrismaClient as PostgresClient } from "@prisma/client";

const sqlite = new SQLiteClient();
const postgres = new PostgresClient();

async function main() {
    console.log("========================================");
    console.log(" SQLite → PostgreSQL migration");
    console.log("========================================");
    console.log();

    /*
     * Read everything from SQLite first.
     * Nothing is modified in SQLite.
     */
    const [
        skills,
        projects,
        adminUsers,
        profiles,
        experiences,
        chatFeedback,
        projectSkills,
    ] = await Promise.all([
        sqlite.skill.findMany(),
        sqlite.project.findMany(),
        sqlite.adminUser.findMany(),
        sqlite.profile.findMany(),
        sqlite.experience.findMany(),
        sqlite.chatFeedback.findMany(),
        sqlite.projectSkill.findMany(),
    ]);

    console.log(`Skills:        ${skills.length}`);
    console.log(`Projects:      ${projects.length}`);
    console.log(`Admin users:   ${adminUsers.length}`);
    console.log(`Profiles:      ${profiles.length}`);
    console.log(`Experiences:   ${experiences.length}`);
    console.log(`Chat feedback: ${chatFeedback.length}`);
    console.log(`ProjectSkills: ${projectSkills.length}`);
    console.log();

    /*
     * Safety check.
     *
     * We don't want to accidentally overwrite a populated
     * production database.
     */
    const existingProjects = await postgres.project.count();
    const existingSkills = await postgres.skill.count();
    const existingProfiles = await postgres.profile.count();

    if (
        existingProjects > 0 ||
        existingSkills > 0 ||
        existingProfiles > 0
    ) {
        throw new Error(
            "PostgreSQL already contains portfolio data. Migration stopped for safety.",
        );
    }

    /*
     * Copy data inside one PostgreSQL transaction.
     */
    await postgres.$transaction(async (tx) => {
        console.log("Copying Profile...");

        if (profiles.length > 0) {
            await tx.profile.createMany({
                data: profiles,
            });
        }

        console.log("Copying Experiences...");

        if (experiences.length > 0) {
            await tx.experience.createMany({
                data: experiences,
            });
        }

        console.log("Copying Skills...");

        if (skills.length > 0) {
            await tx.skill.createMany({
                data: skills,
            });
        }

        console.log("Copying Projects...");

        if (projects.length > 0) {
            await tx.project.createMany({
                data: projects,
            });
        }

        console.log("Copying Admin users...");

        if (adminUsers.length > 0) {
            await tx.adminUser.createMany({
                data: adminUsers,
            });
        }

        console.log("Copying Chat feedback...");

        if (chatFeedback.length > 0) {
            await tx.chatFeedback.createMany({
                data: chatFeedback,
            });
        }

        console.log("Copying Project ↔ Skill relationships...");

        if (projectSkills.length > 0) {
            await tx.projectSkill.createMany({
                data: projectSkills,
                skipDuplicates: true,
            });
        }
    });

    /*
     * PostgreSQL sequences need to be moved past the imported IDs.
     *
     * Otherwise PostgreSQL could try to reuse an existing ID
     * when a new record is created later.
     */
    console.log();
    console.log("Updating PostgreSQL sequences...");

    await postgres.$executeRawUnsafe(`
        SELECT setval(
            pg_get_serial_sequence('"Skill"', 'id'),
            COALESCE((SELECT MAX(id) FROM "Skill"), 1),
            true
        )
    `);

    await postgres.$executeRawUnsafe(`
        SELECT setval(
            pg_get_serial_sequence('"Project"', 'id'),
            COALESCE((SELECT MAX(id) FROM "Project"), 1),
            true
        )
    `);

    await postgres.$executeRawUnsafe(`
        SELECT setval(
            pg_get_serial_sequence('"Profile"', 'id'),
            COALESCE((SELECT MAX(id) FROM "Profile"), 1),
            true
        )
    `);

    await postgres.$executeRawUnsafe(`
        SELECT setval(
            pg_get_serial_sequence('"Experience"', 'id'),
            COALESCE((SELECT MAX(id) FROM "Experience"), 1),
            true
        )
    `);

    console.log();
    console.log("========================================");
    console.log(" Migration completed successfully!");
    console.log("========================================");
}

main()
    .catch((error) => {
        console.error();
        console.error("Migration failed:");
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await sqlite.$disconnect();
        await postgres.$disconnect();
    });