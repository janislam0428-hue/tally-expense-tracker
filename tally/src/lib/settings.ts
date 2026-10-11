import "server-only";
import { db } from "@/lib/db";

export async function getSettings() {
  return db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export type AppSettings = Awaited<ReturnType<typeof getSettings>>;

/** Where clause fragment that hides demo rows once demo data is switched off. */
export function demoScope(settings: Pick<AppSettings, "demoEnabled">) {
  return settings.demoEnabled ? {} : { isDemo: false };
}
