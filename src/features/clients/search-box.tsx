"use client";
import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const tabs = [["", "Todos"], ["ativos", "Ativos"], ["inativos", "Inativos"]] as const;
export function SearchBox() {
  const sp = useSearchParams(), router = useRouter(), path = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const go = (k: string, v: string) => {
    const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k);
    router.replace(n.size ? `${path}?${n}` : path);
  };
  const status = sp.get("status") ?? "";
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input defaultValue={sp.get("q") ?? ""} placeholder="Buscar por nome, marca, e-mail ou telefone"
          onChange={(e) => { clearTimeout(timer.current); const v = e.target.value; timer.current = setTimeout(() => go("q", v), 300); }}
          className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none transition focus:border-brand" />
      </div>
      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {tabs.map(([v, l]) => (
          <button key={v} onClick={() => go("status", v)} className={`h-9 rounded-md px-4 text-sm font-medium transition ${status === v ? "bg-brand/10 text-brand" : "text-muted hover:text-fg"}`}>{l}</button>
        ))}
      </div>
    </div>
  );
}
