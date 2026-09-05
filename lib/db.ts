import * as PrismaClientModule from "@prisma/client";

type PrismaClientLike = {
    skill: any;
    project: any;
    adminUser: any;
    profile: any;
    experience: any;
    chatFeedback: any;
    projectSkill: any;
    $transaction: <T>(
        callback: (tx: PrismaClientLike) => Promise<T>,
    ) => Promise<T>;
    $queryRawUnsafe: (
        query: string,
        ...values: any[]
    ) => Promise<any>;
    $disconnect: () => Promise<void>;
    $on: (...args: any[]) => void;
};

const PrismaClientCtor = (PrismaClientModule as any)
    .PrismaClient as new (
        args?: Record<string, unknown>,
    ) => PrismaClientLike;

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClientLike;
};

export const prisma: PrismaClientLike =
    globalForPrisma.prisma ??
    new PrismaClientCtor({
        log:
            process.env.NODE_ENV === "production"
                ? []
                : ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/**
 * PostgreSQL / Neon does not need the old SQLite
 * database-rebuild logic.
 *
 * Prisma + Neon handles the database schema.
 *
 * The schema is created/updated with Prisma CLI:
 *
 *   npx prisma db push
 *
 * or migrations in production.
 */
export async function ensureDatabase(): Promise<void> {
    // The database schema is managed by Prisma.
    //
    // Do NOT execute SQLite SQL here.
    //
    // In particular, do not use:
    // - AUTOINCREMENT
    // - sqlite_master
    // - PRAGMA table_info
    // - SQLite CREATE TABLE statements
    //
    // Neon PostgreSQL is already initialized by Prisma.
    return;
}