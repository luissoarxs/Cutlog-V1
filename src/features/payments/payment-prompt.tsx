"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setPaidAction } from "./actions";
import { brl, dateOnly, today } from "@/lib/format";

type Item = { id: string; amount: number; due_date: string; client: string; video: string };
// Aviso discreto ao abrir a plataforma: pagamentos que vencem hoje ou já venceram.
export function PaymentPrompt({ items }: { items: Item[] }) {
  const [gone, setGone] = useState<string[]>([]);
  const [pending, start] = useTransition();
  const left = items.filter((i) => !gone.includes(i.id));
  const cur = left[0];
  if (!cur) return null;
  const late = cur.due_date < today();
  const yes = () => start(async () => {
    const r = await setPaidAction(cur.id, true);
    r.ok ? toast.success("Pagamento marcado como recebido.") : toast.error("Não foi possível atualizar o pagamento.");
    if (r.ok) setGone((g) => [...g, cur.id]);
  });
  return (
    <div role="dialog" aria-label="Confirmar pagamento" className="rise fixed inset-x-4 bottom-24 z-30 rounded-2xl border border-border bg-surface p-5 shadow-xl md:inset-x-auto md:bottom-6 md:right-6 md:w-96">
      <p className="font-medium">Você já recebeu este pagamento?</p>
      <p className="mt-1 text-sm text-muted">{cur.client} · {cur.video}</p>
      <p className="num mt-2 text-2xl font-semibold">{brl(cur.amount)}</p>
      <p className={`text-sm ${late ? "text-danger" : "text-warning"}`}>{late ? `Venceu em ${dateOnly(cur.due_date)}` : "Vence hoje"}{left.length > 1 ? ` · mais ${left.length - 1} na fila` : ""}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={yes} disabled={pending} className="h-10 flex-1 rounded-lg bg-success font-medium text-white transition hover:opacity-90 disabled:opacity-60 dark:text-black">SIM</button>
        <button onClick={() => setGone((g) => [...g, cur.id])} className="h-10 flex-1 rounded-lg border border-border font-medium transition hover:bg-bg">AINDA NÃO</button>
      </div>
    </div>
  );
}
