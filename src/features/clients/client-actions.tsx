"use client";
import { useRef } from "react";
import { setActiveAction, deleteClientAction } from "./actions";

export function ClientActions({ id, active, hasVideos }: { id: string; active: boolean; hasVideos: boolean }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const btn = "h-10 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-bg";
  return (
    <>
      <form action={setActiveAction.bind(null, id, !active)}><button className={btn}>{active ? "Inativar" : "Reativar"}</button></form>
      {hasVideos ? null : <button onClick={() => dlg.current?.showModal()} className={`${btn} text-danger`}>Excluir</button>}
      <dialog ref={dlg} className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-border bg-surface p-6 text-fg backdrop:bg-black/50">
        <h3 className="text-lg font-semibold">Excluir este cliente?</h3>
        <p className="mt-2 text-sm text-muted">Essa ação não pode ser desfeita. Se quiser manter o histórico, inative o cliente.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => dlg.current?.close()} className={btn}>Cancelar</button>
          <form action={deleteClientAction.bind(null, id)}><button className="h-10 rounded-lg bg-danger px-4 text-sm font-medium text-white">Excluir cliente</button></form>
        </div>
      </dialog>
    </>
  );
}
