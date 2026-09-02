import * as PrismaClientModule from '@prisma/client';

type PrismaClientLike = {
  skill: any;
  project: any;
  adminUser: any;
  $disconnect: () => Promise<void>;
  $on: (...args: any[]) => void;
};

const PrismaClientCtor = (PrismaClientModule as any).PrismaClient as new (
  args?: Record<string, unknown>,
) => PrismaClientLike;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientLike;
};

export const prisma: PrismaClientLike =
  globalForPrisma.prisma ??
  new PrismaClientCtor({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
