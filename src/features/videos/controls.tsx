"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setStatusAction, setViewsAction } from "./actions";
import { STATUSES, type VideoStatus } from "./schema";

export function StatusSelect({ id, status }: { id: string; status: VideoStatus }) {
  const [pending, start] = useTransition();
  return (
    <select aria-label="Status de produção" defaultValue={status} disabled={pending}
      onChange={(e) => start(async () => { const r = await setStatusAction(id, e.target.value as VideoStatus); r.ok ? toast.success("Status atualizado.") : toast.error("Não foi possível atualizar."); })}
      className="h-10 rounded-lg border border-border bg-surface px-3 text-sm font-medium outline-none transition focus:border-brand disabled:opacity-60">
      {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
export function ViewsForm({ id, views }: { id: string; views: number }) {
  const [val, setVal] = useState(String(views));
  const [pending, start] = useTransition();
  return (
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); start(async () => { const r = await setViewsAction(id, val); r.ok ? toast.success("Visualizações atualizadas.") : toast.error("Número inválido."); }); }}>
      <input aria-label="Visualizações" inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand" />
      <button disabled={pending} className="h-10 rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg transition hover:opacity-90 disabled:opacity-60">{pending ? "Salvando..." : "Atualizar"}</button>
    </form>
  );
}
