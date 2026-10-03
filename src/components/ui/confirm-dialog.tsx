"use client";
import { useRef } from "react";
export function ConfirmDialog({ label, title, text, confirm, action }: { label: string; title: string; text: string; confirm: string; action: () => Promise<void> }) {
  const d = useRef<HTMLDialogElement>(null);
  const btn = "h-10 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-bg";
  return (
    <>
      <button onClick={() => d.current?.showModal()} className={`${btn} text-danger`}>{label}</button>
      <dialog ref={d} className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-border bg-surface p-6 text-fg backdrop:bg-black/50">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => d.current?.close()} className={btn}>Cancelar</button>
          <form action={action}><button className="h-10 rounded-lg bg-danger px-4 text-sm font-medium text-white">{confirm}</button></form>
        </div>
      </dialog>
    </>
  );
}
