import * as PrismaClientModule from '@prisma/client';

type PrismaClientLike = {
  skill: any;
  project: any;
  adminUser: any;
  profile: any;
  experience: any;
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

const createSql = `
  CREATE TABLE IF NOT EXISTS "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Project" (
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
  );

  CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT,
    "location" TEXT,
    "summary" TEXT NOT NULL,
    "availability" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "description" TEXT NOT NULL,
    "technologies" TEXT NOT NULL DEFAULT '',
    "current" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

async function rebuildDatabase() {
  await prisma.$executeRawUnsafe(createSql);
}

export async function ensureDatabase() {
  if (globalForPrisma.databaseInitPromise) {
    await globalForPrisma.databaseInitPromise;
    return;
  }

  globalForPrisma.databaseInitPromise = (async () => {
    try {
      const existingTables = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('Skill', 'Project', 'AdminUser', 'Profile', 'Experience');`,
      );

      const tableSet = new Set(existingTables.map((row) => row.name));
      const missing = ['Skill', 'Project', 'AdminUser', 'Profile', 'Experience'].filter((table) => !tableSet.has(table));

      if (missing.length > 0) {
        await rebuildDatabase();
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
