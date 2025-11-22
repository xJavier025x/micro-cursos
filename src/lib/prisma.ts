// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Pool de conexión de pg usando tu DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Adapter de Prisma 7 para PostgreSQL
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Singleton para Next.js (evitar múltiples instancias en dev)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // log: ["query", "error", "warn"], // opcional para debug
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
