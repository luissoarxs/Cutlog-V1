import { createClient } from "@/lib/supabase/server";
import { allPayments, sumPayments } from "@/features/payments/queries";
import { monthly } from "@/lib/format";

export async function loadDashboard() {
  const db = await createClient();
  const [v, pays, c, a] = await Promise.all([
    db.from("videos").select("status,views,created_at"),
    allPayments(),
    db.from("clients").select("id", { count: "exact", head: true }),
    db.from("activity_log").select("id,message,created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const videos = (v.data ?? []) as { status: string; views: number; created_at: string }[];
  const by = (...s: string[]) => videos.filter((x) => s.includes(x.status)).length;
  return {
    totals: sumPayments(pays), clients: c.count ?? 0, videos: videos.length,
    prod: { edited: by("editado", "pronto_para_postar", "publicado"), editing: by("em_edicao"), ready: by("pronto_para_postar"), published: by("publicado") },
    views: videos.reduce((s, x) => s + x.views, 0),
    viewsSeries: monthly(videos, (x) => x.created_at, (x) => x.views),
    billingSeries: monthly(pays, (p) => p.due_date, (p) => p.amount),
    upcoming: pays.filter((p) => !p.paid_at).sort((x, y) => (x.due_date < y.due_date ? -1 : 1)).slice(0, 5),
    activity: (a.data ?? []) as { id: string; message: string; created_at: string }[],
  };
}
