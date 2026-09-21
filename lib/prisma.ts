import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbFile = path.join(dataDir, "cms.db");
const current = process.env.DATABASE_URL ?? "";
if (!current.startsWith("file:/") || current.startsWith("file:./") || current.startsWith("file:../")) {
	process.env.DATABASE_URL = `file:${dbFile}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
