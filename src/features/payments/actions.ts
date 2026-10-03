"use server";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/lib/supabase/auth";
import { logActivity } from "@/features/activity/log";
import { brl } from "@/lib/format";

export async function setPaidAction(id: string, paid: boolean) {
  const db = await requireDb();
  const { data: p, error } = await db.from("payments").update({ paid_at: paid ? new Date().toISOString() : null }).eq("id", id).select("amount,videos(title)").single();
  if (error || !p) return { ok: false };
  const title = (p.videos as unknown as { title: string } | null)?.title ?? "vídeo";
  await logActivity(db, paid ? `Pagamento de ${brl(Number(p.amount))} marcado como recebido (${title})` : `Pagamento de ${brl(Number(p.amount))} reaberto (${title})`);
  revalidatePath("/", "layout");
  return { ok: true };
}
