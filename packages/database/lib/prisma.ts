import "dotenv/config";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL não foi definida em packages/database/.env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };