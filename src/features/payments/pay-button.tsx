"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { setPaidAction } from "./actions";

export function PayButton({ id, paid }: { id: string; paid: boolean }) {
  const [pending, start] = useTransition();
  const run = () => start(async () => {
    const r = await setPaidAction(id, !paid);
    r.ok ? toast.success(paid ? "Pagamento reaberto." : "Pagamento marcado como recebido.") : toast.error("Não foi possível atualizar o pagamento.");
  });
  return paid
    ? <button onClick={run} disabled={pending} className="text-xs text-muted underline-offset-2 transition hover:text-fg hover:underline disabled:opacity-50">Desfazer</button>
    : <button onClick={run} disabled={pending} className="h-9 rounded-lg bg-success/10 px-3 text-sm font-medium text-success transition hover:bg-success/20 disabled:opacity-50">{pending ? "Salvando..." : "Marcar como pago"}</button>;
}
