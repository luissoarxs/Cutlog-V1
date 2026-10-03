import { z } from "zod";

export type Client = {
  id: string; name: string; brand: string | null; phone: string | null; email: string | null;
  default_video_price: number; payment_day: number | null; notes: string | null; active: boolean; created_at: string;
};

// "1.200,50" -> 1200.5 | "60" -> 60 | "" -> 0
export function parseMoney(v: string) {
  const s = v.replace(/[R$\s]/g, "");
  if (!s) return 0;
  return Number(s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s);
}

const schema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente."),
  brand: z.string().trim(), phone: z.string().trim(), notes: z.string().trim(),
  email: z.union([z.literal(""), z.string().trim().email("E-mail inválido.")]),
  default_video_price: z.number({ error: "Valor inválido." }).finite("Valor inválido.").min(0, "Valor inválido."),
  payment_day: z.number().int("Use um dia de 1 a 31.").min(1, "Use um dia de 1 a 31.").max(31, "Use um dia de 1 a 31.").nullable(),
});

export function parseClientForm(fd: FormData) {
  const g = (k: string) => String(fd.get(k) ?? "").trim();
  const day = g("payment_day");
  const r = schema.safeParse({
    name: g("name"), brand: g("brand"), phone: g("phone"), notes: g("notes"), email: g("email"),
    default_video_price: parseMoney(g("default_video_price")), payment_day: day ? Number(day) : null,
  });
  if (!r.success) {
    const fields: Record<string, string> = {};
    r.error.issues.forEach((i) => { fields[String(i.path[0])] ??= i.message; });
    return { ok: false as const, fields };
  }
  const d = r.data, n = (s: string) => s || null;
  return { ok: true as const, data: { name: d.name, brand: n(d.brand), phone: n(d.phone), email: n(d.email), notes: n(d.notes),
    default_video_price: d.default_video_price, payment_day: d.payment_day } };
}
