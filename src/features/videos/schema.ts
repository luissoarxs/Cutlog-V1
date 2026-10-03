import { z } from "zod";
import { parseMoney } from "@/features/clients/schema";
import { today } from "@/lib/format";

export const STATUSES = [["a_fazer", "A fazer"], ["em_edicao", "Em edição"], ["editado", "Editado"], ["pronto_para_postar", "Pronto para postar"], ["publicado", "Publicado"]] as const;
export type VideoStatus = (typeof STATUSES)[number][0];
export const statusLabel = Object.fromEntries(STATUSES) as Record<VideoStatus, string>;
export type Video = { id: string; client_id: string; title: string; property: string | null; location: string | null; description: string | null; notes: string | null;
  drive_url: string | null; status: VideoStatus; published_at: string | null; views: number; created_at: string };

export const parseCount = (s: string) => { const t = s.replace(/[.\s]/g, ""); return t ? Number(t) : 0; };

// Próxima data com o dia combinado do cliente (ex.: dia 10).
export function nextDue(day: number | null) {
  if (!day) return "";
  const [y, m] = today().split("-").map(Number);
  const mk = (yy: number, mm: number) => `${yy}-${String(mm).padStart(2, "0")}-${String(Math.min(day, new Date(yy, mm, 0).getDate())).padStart(2, "0")}`;
  const c = mk(y, m);
  return c >= today() ? c : m === 12 ? mk(y + 1, 1) : mk(y, m + 1);
}

const schema = z.object({
  client_id: z.string().uuid("Escolha o cliente."),
  title: z.string().trim().min(2, "Informe o título do vídeo."),
  property: z.string().trim(), location: z.string().trim(), description: z.string().trim(), notes: z.string().trim(),
  drive_url: z.union([z.literal(""), z.string().trim().url("Link inválido.").refine((u) => /^https?:\/\//.test(u), "Link inválido.")]),
  status: z.enum(["a_fazer", "em_edicao", "editado", "pronto_para_postar", "publicado"], { error: "Status inválido." }),
  views: z.number({ error: "Número inválido." }).int("Número inválido.").min(0, "Número inválido."),
  amount: z.number({ error: "Valor inválido." }).finite("Valor inválido.").min(0, "Valor inválido."),
  due_date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.")]),
}).refine((d) => d.amount === 0 || d.due_date !== "", { path: ["due_date"], message: "Informe a data de pagamento." });

export function parseVideoForm(fd: FormData) {
  const g = (k: string) => String(fd.get(k) ?? "").trim();
  const r = schema.safeParse({ client_id: g("client_id"), title: g("title"), property: g("property"), location: g("location"), description: g("description"),
    notes: g("notes"), drive_url: g("drive_url"), status: g("status") || "a_fazer", views: parseCount(g("views")), amount: parseMoney(g("amount")), due_date: g("due_date") });
  if (!r.success) {
    const fields: Record<string, string> = {};
    r.error.issues.forEach((i) => { fields[String(i.path[0])] ??= i.message; });
    return { ok: false as const, fields };
  }
  const d = r.data, n = (s: string) => s || null;
  return { ok: true as const,
    video: { client_id: d.client_id, title: d.title, property: n(d.property), location: n(d.location), description: n(d.description), notes: n(d.notes), drive_url: n(d.drive_url), status: d.status, views: d.views },
    payment: d.amount > 0 ? { amount: d.amount, due_date: d.due_date } : null };
}
