"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Client } from "./schema";
import type { FormState } from "./actions";

const input = "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand";
function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="h-11 rounded-lg bg-brand px-6 font-medium text-brand-fg transition hover:opacity-90 disabled:opacity-60">{pending ? "Salvando..." : label}</button>;
}
function Field({ label, name, err, children }: { label: string; name: string; err?: string; children: React.ReactNode }) {
  return <div><label htmlFor={name} className="mb-1.5 block text-sm font-medium">{label}</label>{children}{err && <p className="mt-1 text-xs text-danger">{err}</p>}</div>;
}

export function ClientForm({ action, client, cancelHref }: { action: (s: FormState, fd: FormData) => Promise<FormState>; client?: Client; cancelHref: string }) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const e = state.fields ?? {};
  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium">Informações</h2>
        <Field label="Nome" name="name" err={e.name}><input id="name" name="name" defaultValue={client?.name} required className={input} /></Field>
        <Field label="Empresa ou marca" name="brand"><input id="brand" name="brand" defaultValue={client?.brand ?? ""} className={input} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefone" name="phone"><input id="phone" name="phone" type="tel" defaultValue={client?.phone ?? ""} className={input} /></Field>
          <Field label="E-mail" name="email" err={e.email}><input id="email" name="email" type="email" defaultValue={client?.email ?? ""} className={input} /></Field>
        </div>
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium">Financeiro</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Valor padrão por vídeo (R$)" name="default_video_price" err={e.default_video_price}>
            <input id="default_video_price" name="default_video_price" inputMode="decimal" placeholder="60,00" defaultValue={client ? String(client.default_video_price).replace(".", ",") : ""} className={input} />
          </Field>
          <Field label="Dia combinado do pagamento" name="payment_day" err={e.payment_day}>
            <input id="payment_day" name="payment_day" inputMode="numeric" placeholder="Ex.: 10" defaultValue={client?.payment_day ?? ""} className={input} />
          </Field>
        </div>
        <Field label="Observações" name="notes"><textarea id="notes" name="notes" rows={3} defaultValue={client?.notes ?? ""} className={`${input} h-auto py-2.5`} /></Field>
      </section>
      {state.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <div className="flex justify-end gap-3">
        <Link href={cancelHref} className="grid h-11 place-items-center rounded-lg border border-border px-5 text-sm font-medium transition hover:bg-surface">Cancelar</Link>
        <Submit label={client ? "Salvar alterações" : "Salvar cliente"} />
      </div>
    </form>
  );
}
