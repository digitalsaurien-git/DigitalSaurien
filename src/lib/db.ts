import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString?.startsWith("postgresql") || connectionString?.startsWith("postgres")) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // Fallback direct for SQLite/Dev (Note: Prisma 7 might require driver adapter for SQLite too)
  // For now, we assume development will happen on PostgreSQL/Supabase directly to avoid REX issues.
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_NODE !== "production") globalForPrisma.prisma = prisma;
