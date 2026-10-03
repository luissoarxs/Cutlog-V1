export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dateBR = (d: string) => new Date(d).toLocaleDateString("pt-BR");
export const num = (n: number) => n.toLocaleString("pt-BR");
export const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
export const dateOnly = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR");
export const dateTime = (d: string) => new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
export const monthLabel = (k: string) => new Date(k + "-15T12:00:00").toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "");
export type PayStatus = "pago" | "pendente" | "atrasado";
// "Atrasado" nunca é gravado: pendente + vencido.
export const payStatus = (p: { paid_at: string | null; due_date: string }): PayStatus => (p.paid_at ? "pago" : p.due_date < today() ? "atrasado" : "pendente");
export function monthly<T>(rows: T[], key: (r: T) => string, val: (r: T) => number) {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(key(r).slice(0, 7), (m.get(key(r).slice(0, 7)) ?? 0) + val(r)));
  return [...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, value]) => ({ label: monthLabel(k), value }));
}
