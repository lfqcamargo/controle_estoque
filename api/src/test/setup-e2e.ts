import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { PrismaClient } from "../generated/prisma";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { DomainEvents } from "@/core/events/domain-events";
import { app } from "@/infra/server/app";

const schemaId = randomUUID();
const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;
  execSync("npx prisma migrate deploy");

  await app.ready();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();

  await app.close();
});

beforeEach(async () => {
  DomainEvents.shouldRun = false;
});
