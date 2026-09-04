import * as PrismaClientModule from '@prisma/client';

type PrismaClientLike = {
  skill: any;
  project: any;
  adminUser: any;
  profile: any;
  experience: any;
  chatFeedback: any;
  projectSkill: any;
  $transaction: <T>(callback: (tx: PrismaClientLike) => Promise<T>) => Promise<T>;
  $disconnect: () => Promise<void>;
  $on: (...args: any[]) => void;
  $queryRawUnsafe: <T = unknown>(query: string, ...values: any[]) => Promise<T>;
  $executeRawUnsafe: (query: string, ...values: any[]) => Promise<any>;
};

const PrismaClientCtor = (PrismaClientModule as any).PrismaClient as new (
  args?: Record<string, unknown>,
) => PrismaClientLike;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientLike;
  databaseInitPromise?: Promise<void>;
};

export const prisma: PrismaClientLike =
  globalForPrisma.prisma ??
  new PrismaClientCtor({
    log: process.env.NODE_ENV === 'production' ? [] : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

if (typeof window === 'undefined') {
  void ensureDatabase();
}

const createStatements = [
  `CREATE TABLE IF NOT EXISTS "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "githubUrl" TEXT,
    "imageUrl" TEXT,
    "featured" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "headline" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "location" TEXT,
    "summary" TEXT NOT NULL,
    "availability" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "description" TEXT NOT NULL,
    "technologies" TEXT NOT NULL DEFAULT '',
    "current" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "ChatFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "reason" TEXT,
    "comment" TEXT,
    "question" TEXT,
    "answer" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "ProjectSkill" (
    "projectId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    PRIMARY KEY ("projectId", "skillId"),
    CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
];

const indexStatements = [
  `CREATE INDEX IF NOT EXISTS "Skill_category_idx" ON "Skill"("category")`,
  `CREATE INDEX IF NOT EXISTS "Skill_order_idx" ON "Skill"("order")`,
  `CREATE INDEX IF NOT EXISTS "Project_featured_idx" ON "Project"("featured")`,
  `CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status")`,
  `CREATE INDEX IF NOT EXISTS "AdminUser_role_idx" ON "AdminUser"("role")`,
  `CREATE INDEX IF NOT EXISTS "Experience_current_idx" ON "Experience"("current")`,
  `CREATE INDEX IF NOT EXISTS "ChatFeedback_value_idx" ON "ChatFeedback"("value")`,
  `CREATE INDEX IF NOT EXISTS "ChatFeedback_createdAt_idx" ON "ChatFeedback"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "ProjectSkill_skillId_idx" ON "ProjectSkill"("skillId")`,
];

async function rebuildDatabase() {
  for (const statement of createStatements) {
    await prisma.$executeRawUnsafe(statement);
  }

  for (const statement of indexStatements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

export async function ensureDatabase() {
  if (globalForPrisma.databaseInitPromise) {
    await globalForPrisma.databaseInitPromise;
    return;
  }

  globalForPrisma.databaseInitPromise = (async () => {
    try {
      const existingTables = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('Skill', 'Project', 'AdminUser', 'Profile', 'Experience', 'ChatFeedback');`,
      );

      const tableSet = new Set(existingTables.map((row) => row.name));
      const missing = ['Skill', 'Project', 'AdminUser', 'Profile', 'Experience', 'ChatFeedback', 'ProjectSkill'].filter((table) => !tableSet.has(table));

      if (missing.length > 0) {
        await rebuildDatabase();
      }

      const profileColumns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
        `PRAGMA table_info("Profile")`,
      );
      const profileColumnSet = new Set(profileColumns.map((column) => column.name));

      if (!profileColumnSet.has('headline')) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "Profile" ADD COLUMN "headline" TEXT NOT NULL DEFAULT ''`,
        );
      }

      if (!profileColumnSet.has('bio')) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "Profile" ADD COLUMN "bio" TEXT NOT NULL DEFAULT ''`,
        );
      }

      const experienceColumns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
        `PRAGMA table_info("Experience")`,
      );
      const experienceColumnSet = new Set(
        experienceColumns.map((column) => column.name),
      );

      if (!experienceColumnSet.has('name')) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "Experience" ADD COLUMN "name" TEXT NOT NULL DEFAULT ''`,
        );
      }

      if (!experienceColumnSet.has('location')) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "Experience" ADD COLUMN "location" TEXT`,
        );
      }
    } catch {
      await rebuildDatabase();
    }
  })();

  try {
    await globalForPrisma.databaseInitPromise;
  } finally {
    if (globalForPrisma.databaseInitPromise) {
      globalForPrisma.databaseInitPromise = undefined;
    }
  }
}
