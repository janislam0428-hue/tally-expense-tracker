import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

// One adapter for both environments:
//   local:      DATABASE_URL="file:./data/tally.db"
//   production: DATABASE_URL="libsql://<db>.turso.io" plus DATABASE_AUTH_TOKEN
export function createDbClient() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./data/tally.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

export type Db = ReturnType<typeof createDbClient>;
