import { createClient } from "@/lib/supabase/server";
import type { Client } from "./schema";

export type Stats = { videos: number; billed: number; received: number; pending: number; views: number; last?: string };
const empty = (): Stats => ({ videos: 0, billed: 0, received: 0, pending: 0, views: 0 });

export async function listClients(q?: string, status?: string) {
  const supabase = await createClient();
  let query = supabase.from("clients").select("*").order("name");
  if (status === "ativos") query = query.eq("active", true);
  if (status === "inativos") query = query.eq("active", false);
  const t = (q ?? "").replace(/[%,()*]/g, " ").trim();
  if (t) query = query.or(`name.ilike.%${t}%,brand.ilike.%${t}%,email.ilike.%${t}%,phone.ilike.%${t}%`);
  const { data } = await query;
  return (data ?? []) as Client[];
}

export async function getClient(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  return data as Client | null;
}

// Agrega vídeos, pagamentos e visualizações (campo views do vídeo) por cliente.
export async function loadStats(clientId?: string) {
  const supabase = await createClient();
  let vq = supabase.from("videos").select("client_id,created_at,views");
  let pq = supabase.from("payments").select("client_id,amount,paid_at");
  if (clientId) { vq = vq.eq("client_id", clientId); pq = pq.eq("client_id", clientId); }
  const [v, p] = await Promise.all([vq, pq]);
  const out: Record<string, Stats> = {};
  const get = (id: string) => (out[id] ??= empty());
  (v.data ?? []).forEach((x) => { const st = get(x.client_id); st.videos++; st.views += x.views ?? 0; if (!st.last || x.created_at > st.last) st.last = x.created_at; });
  (p.data ?? []).forEach((x) => { const st = get(x.client_id), a = Number(x.amount); st.billed += a; x.paid_at ? (st.received += a) : (st.pending += a); });
  return { out, get: (id: string) => out[id] ?? empty() };
}
