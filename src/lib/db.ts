import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaFailed: boolean;
};

export function getDb(): PrismaClient | null {
  if (globalForPrisma.prismaFailed) return null;

  try {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
  } catch {
    globalForPrisma.prismaFailed = true;
    console.warn("Prisma client initialization failed (no SQLite on Vercel)");
    return null;
  }
}
