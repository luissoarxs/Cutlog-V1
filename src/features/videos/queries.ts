import { createClient } from "@/lib/supabase/server";
import type { Video } from "./schema";

export type Pay = { id: string; amount: number; due_date: string; paid_at: string | null };
export type VideoRow = Video & { clients: { name: string } | null; payments: Pay[] };
const SEL = "*, clients(name), payments(id,amount,due_date,paid_at)";

export async function listVideos(opts: { q?: string; status?: string; clientId?: string } = {}) {
  const db = await createClient();
  let query = db.from("videos").select(SEL).order("created_at", { ascending: false });
  if (opts.status) query = query.eq("status", opts.status);
  if (opts.clientId) query = query.eq("client_id", opts.clientId);
  const { data } = await query;
  let rows = ((data ?? []) as VideoRow[]).map((v) => ({ ...v, payments: (v.payments ?? []).map((p) => ({ ...p, amount: Number(p.amount) })) }));
  const t = (opts.q ?? "").trim().toLowerCase();
  if (t) rows = rows.filter((v) => [v.title, v.property, v.location, v.clients?.name].some((s) => s?.toLowerCase().includes(t)));
  return rows;
}
export async function getVideo(id: string) {
  const db = await createClient();
  const { data } = await db.from("videos").select(SEL).eq("id", id).maybeSingle();
  if (!data) return null;
  const v = data as VideoRow;
  return { ...v, payments: (v.payments ?? []).map((p) => ({ ...p, amount: Number(p.amount) })) } as VideoRow;
}
export async function formClients() {
  const db = await createClient();
  const { data } = await db.from("clients").select("id,name,default_video_price,payment_day,active").order("name");
  return (data ?? []).filter((c) => c.active).map((c) => ({ id: c.id as string, name: c.name as string, price: Number(c.default_video_price), day: (c.payment_day ?? null) as number | null }));
}
