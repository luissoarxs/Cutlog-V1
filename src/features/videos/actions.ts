"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/lib/supabase/auth";
import { logActivity } from "@/features/activity/log";
import { parseVideoForm, parseCount, STATUSES, type VideoStatus } from "./schema";
import { today, num } from "@/lib/format";

export type FormState = { error?: string; fields?: Record<string, string> };
const refresh = () => revalidatePath("/", "layout");

export async function createVideoAction(_: FormState, fd: FormData): Promise<FormState> {
  const p = parseVideoForm(fd);
  if (!p.ok) return { fields: p.fields };
  const db = await requireDb();
  const { data, error } = await db.from("videos").insert({ ...p.video, published_at: p.video.status === "publicado" ? today() : null }).select("id").single();
  if (error || !data) return { error: "Não foi possível salvar o vídeo. Tente de novo." };
  if (p.payment) {
    const { error: pe } = await db.from("payments").insert({ video_id: data.id, client_id: p.video.client_id, ...p.payment });
    if (pe) { await db.from("videos").delete().eq("id", data.id); return { error: "Não foi possível criar o pagamento. Nada foi salvo; tente de novo." }; }
  }
  await logActivity(db, `Você adicionou o vídeo ${p.video.title}`);
  if (p.video.status === "publicado") await logActivity(db, `Vídeo ${p.video.title} foi publicado`);
  if (p.video.views > 0) await logActivity(db, `Visualizações de ${p.video.title} atualizadas para ${num(p.video.views)}`);
  refresh();
  redirect(`/videos/${data.id}?ok=video_criado`);
}

export async function updateVideoAction(id: string, _: FormState, fd: FormData): Promise<FormState> {
  const p = parseVideoForm(fd);
  if (!p.ok) return { fields: p.fields };
  const db = await requireDb();
  const { data: cur } = await db.from("videos").select("status,published_at,views").eq("id", id).single();
  if (!cur) return { error: "Vídeo não encontrado." };
  const nowPub = p.video.status === "publicado" && cur.status !== "publicado";
  const { error } = await db.from("videos").update({ ...p.video, published_at: nowPub ? today() : p.video.status === "publicado" ? cur.published_at : null }).eq("id", id);
  if (error) return { error: "Não foi possível salvar. Tente de novo." };
  const { data: pay } = await db.from("payments").select("id,paid_at").eq("video_id", id).maybeSingle();
  if (p.payment && !pay) await db.from("payments").insert({ video_id: id, client_id: p.video.client_id, ...p.payment });
  else if (pay && !pay.paid_at) {
    if (p.payment) await db.from("payments").update({ ...p.payment, client_id: p.video.client_id }).eq("id", pay.id);
    else await db.from("payments").delete().eq("id", pay.id); // valor zerado: remove o pendente
  }
  await logActivity(db, `Você editou o vídeo ${p.video.title}`);
  if (nowPub) await logActivity(db, `Vídeo ${p.video.title} foi publicado`);
  if (p.video.views !== cur.views) await logActivity(db, `Visualizações de ${p.video.title} atualizadas para ${num(p.video.views)}`);
  refresh();
  redirect(`/videos/${id}?ok=video_atualizado`);
}

export async function setStatusAction(id: string, status: VideoStatus) {
  if (!STATUSES.some(([v]) => v === status)) return { ok: false };
  const db = await requireDb();
  const { data: cur } = await db.from("videos").select("title,status,published_at").eq("id", id).single();
  if (!cur) return { ok: false };
  const nowPub = status === "publicado" && cur.status !== "publicado";
  const { error } = await db.from("videos").update({ status, published_at: nowPub ? today() : status === "publicado" ? cur.published_at : null }).eq("id", id);
  if (error) return { ok: false };
  if (nowPub) await logActivity(db, `Vídeo ${cur.title} foi publicado`);
  refresh();
  return { ok: true };
}

export async function setViewsAction(id: string, raw: string) {
  const n = parseCount(raw);
  if (!Number.isInteger(n) || n < 0) return { ok: false };
  const db = await requireDb();
  const { data: v, error } = await db.from("videos").update({ views: n }).eq("id", id).select("title").single();
  if (error || !v) return { ok: false };
  await logActivity(db, `Visualizações de ${v.title} atualizadas para ${num(n)}`);
  refresh();
  return { ok: true };
}

export async function deleteVideoAction(id: string) {
  const db = await requireDb();
  const { data: v } = await db.from("videos").select("title,client_id").eq("id", id).single();
  if (!v) redirect("/videos");
  const { error } = await db.from("videos").delete().eq("id", id);
  if (error) redirect(`/videos/${id}?ok=erro`);
  await logActivity(db, `Você excluiu o vídeo ${v.title}`);
  refresh();
  redirect(`/clientes/${v.client_id}?ok=video_excluido`);
}
