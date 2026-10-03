import { createClient } from "@/lib/supabase/server";
import { payStatus, today } from "@/lib/format";

export type PayRow = { id: string; amount: number; due_date: string; paid_at: string | null; client_id: string; clients: { name: string } | null; videos: { id: string; title: string } | null };

// A receber = tudo que ainda não foi pago (inclui atrasado). Atrasado = parte vencida. Recebido + A receber = Faturado.
export function sumPayments(rows: { amount: number; due_date: string; paid_at: string | null }[]) {
  const t = { received: 0, pending: 0, overdue: 0, billed: 0 };
  rows.forEach((r) => { const a = Number(r.amount); t.billed += a; if (r.paid_at) t.received += a; else { t.pending += a; if (payStatus(r) === "atrasado") t.overdue += a; } });
  return t;
}
export async function allPayments() {
  const db = await createClient();
  const { data } = await db.from("payments").select("id,amount,due_date,paid_at,client_id,clients(name),videos(id,title)").order("due_date", { ascending: false });
  return ((data ?? []) as unknown as PayRow[]).map((p) => ({ ...p, amount: Number(p.amount) }));
}
export async function loadWallet(f: { status?: string; cliente?: string; mes?: string }) {
  const all = await allPayments();
  const rows = all.filter((p) => (!f.status || payStatus(p) === f.status) && (!f.cliente || p.client_id === f.cliente) && (!f.mes || p.due_date.startsWith(f.mes)));
  return { totals: sumPayments(all), rows };
}
export async function duePayments() {
  const db = await createClient();
  const { data } = await db.from("payments").select("id,amount,due_date,clients(name),videos(title)").is("paid_at", null).lte("due_date", today()).order("due_date");
  return ((data ?? []) as unknown as { id: string; amount: number; due_date: string; clients: { name: string } | null; videos: { title: string } | null }[])
    .map((p) => ({ id: p.id, amount: Number(p.amount), due_date: p.due_date, client: p.clients?.name ?? "", video: p.videos?.title ?? "" }));
}
