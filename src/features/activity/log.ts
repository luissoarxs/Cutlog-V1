import type { requireDb } from "@/lib/supabase/auth";
export const logActivity = async (db: Awaited<ReturnType<typeof requireDb>>, message: string) => { await db.from("activity_log").insert({ message }); };
