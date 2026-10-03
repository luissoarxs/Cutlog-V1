"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "./actions";
import { STATUSES, nextDue, type Video } from "./schema";

type C = { id: string; name: string; price: number; day: number | null };
const input = "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand disabled:opacity-60";
const fmt = (n: number) => n.toFixed(2).replace(".", ",");
function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="h-11 rounded-lg bg-brand px-6 font-medium text-brand-fg transition hover:opacity-90 disabled:opacity-60">{pending ? "Salvando..." : label}</button>;
}
function F({ label, name, err, children }: { label: string; name: string; err?: string; children: React.ReactNode }) {
  return <div><label htmlFor={name} className="mb-1.5 block text-sm font-medium">{label}</label>{children}{err && <p className="mt-1 text-xs text-danger">{err}</p>}</div>;
}

export function VideoForm({ action, clients, video, clientId, amount, due, paidInfo, cancelHref }: {
  action: (s: FormState, fd: FormData) => Promise<FormState>; clients: C[]; video?: Video; clientId: string; amount: string; due: string; paidInfo?: string; cancelHref: string;
}) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const [cid, setCid] = useState(clientId), [amt, setAmt] = useState(amount), [dueV, setDue] = useState(due), [touched, setTouched] = useState(!!video);
  const e = state.fields ?? {};
  const locked = !!paidInfo;
  const pick = (id: string) => { setCid(id); const c = clients.find((x) => x.id === id); if (c && !touched) { setAmt(fmt(c.price)); setDue(nextDue(c.day)); } };
  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium">Informações do vídeo</h2>
        {video ? <input type="hidden" name="client_id" value={cid} /> : (
          <F label="Cliente" name="client_id" err={e.client_id}>
            <select id="client_id" name="client_id" value={cid} onChange={(ev) => pick(ev.target.value)} className={input}>
              <option value="">Escolha o cliente</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </F>
        )}
        <F label="Título" name="title" err={e.title}><input id="title" name="title" defaultValue={video?.title} required className={input} /></F>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Fazenda, imóvel ou projeto" name="property"><input id="property" name="property" defaultValue={video?.property ?? ""} placeholder="Ex.: 80 alqueires" className={input} /></F>
          <F label="Localização" name="location"><input id="location" name="location" defaultValue={video?.location ?? ""} placeholder="Ex.: Pavão - MG" className={input} /></F>
        </div>
        <F label="Descrição" name="description"><textarea id="description" name="description" rows={2} defaultValue={video?.description ?? ""} className={`${input} h-auto py-2.5`} /></F>
        <F label="Observações" name="notes"><textarea id="notes" name="notes" rows={2} defaultValue={video?.notes ?? ""} className={`${input} h-auto py-2.5`} /></F>
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium">Arquivo e produção</h2>
        <F label="Link do Google Drive" name="drive_url" err={e.drive_url}><input id="drive_url" name="drive_url" type="url" inputMode="url" placeholder="https://drive.google.com/..." defaultValue={video?.drive_url ?? ""} className={input} /></F>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Status de produção" name="status" err={e.status}>
            <select id="status" name="status" defaultValue={video?.status ?? "a_fazer"} className={input}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </F>
          <F label="Visualizações" name="views" err={e.views}><input id="views" name="views" inputMode="numeric" defaultValue={video?.views ?? 0} className={input} /></F>
        </div>
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium">Financeiro</h2>
        {locked && <p className="text-sm text-success">{paidInfo}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Valor (R$)" name="amount" err={e.amount}><input id="amount" name="amount" inputMode="decimal" placeholder="60,00" value={amt} disabled={locked} onChange={(ev) => { setAmt(ev.target.value); setTouched(true); }} className={input} /></F>
          <F label="Data de pagamento" name="due_date" err={e.due_date}><input id="due_date" name="due_date" type="date" value={dueV} disabled={locked} onChange={(ev) => { setDue(ev.target.value); setTouched(true); }} className={input} /></F>
        </div>
      </section>
      {state.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <div className="flex justify-end gap-3">
        <Link href={cancelHref} className="grid h-11 place-items-center rounded-lg border border-border px-5 text-sm font-medium transition hover:bg-surface">Cancelar</Link>
        <Submit label={video ? "Salvar alterações" : "Salvar vídeo"} />
      </div>
    </form>
  );
}
