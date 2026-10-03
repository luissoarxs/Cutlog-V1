import { createClient } from "@/lib/supabase/server";
import { monthly, today } from "@/lib/format";

type V = { id: string; title: string; views: number; created_at: string; client_id: string; clients: { name: string } | null };
// Resultados = visualizações manuais por vídeo. Período filtra pela data de cadastro do vídeo.
export async function loadResults(f: { cliente?: string; periodo?: string }) {
  const db = await createClient();
  let q = db.from("videos").select("id,title,views,created_at,client_id,clients(name)");
  if (f.cliente) q = q.eq("client_id", f.cliente);
  const days = f.periodo === "30d" ? 30 : f.periodo === "90d" ? 90 : 0;
  if (days) q = q.gte("created_at", new Date(Date.now() - days * 864e5).toISOString());
  if (f.periodo === "ano") q = q.gte("created_at", `${today().slice(0, 4)}-01-01T00:00:00-03:00`);
  const [{ data }, { data: cl }] = await Promise.all([q, db.from("clients").select("id,name").order("name")]);
  const videos = (data ?? []) as unknown as V[];
  return {
    videos: videos.length, views: videos.reduce((s, v) => s + v.views, 0),
    top: [...videos].filter((v) => v.views > 0).sort((a, b) => b.views - a.views).slice(0, 8),
    series: monthly(videos, (v) => v.created_at, (v) => v.views),
    clients: (cl ?? []) as { id: string; name: string }[],
  };
}
