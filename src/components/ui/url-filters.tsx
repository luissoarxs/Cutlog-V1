"use client";
import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type Opt = readonly [string, string];
// Filtros guardados na URL (busca, abas, seletor e mês). Reutilizado em Vídeos, Carteira e Resultados.
export function UrlFilters({ search, tabs, tabParam = "status", select, month }: { search?: string; tabs?: readonly Opt[]; tabParam?: string; select?: { param: string; all: string; options: readonly Opt[] }; month?: boolean }) {
  const sp = useSearchParams(), router = useRouter(), path = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const go = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); router.replace(n.size ? `${path}?${n}` : path); };
  const cur = sp.get(tabParam) ?? "";
  const field = "h-11 rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand";
  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      {search && (
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input defaultValue={sp.get("q") ?? ""} placeholder={search} className={`${field} w-full pl-9`}
            onChange={(e) => { clearTimeout(timer.current); const v = e.target.value; timer.current = setTimeout(() => go("q", v), 300); }} />
        </div>
      )}
      {tabs && (
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1">
          {tabs.map(([v, l]) => <button key={v} onClick={() => go(tabParam, v)} className={`h-9 shrink-0 rounded-md px-4 text-sm font-medium transition ${cur === v ? "bg-brand/10 text-brand" : "text-muted hover:text-fg"}`}>{l}</button>)}
        </div>
      )}
      {select && (
        <select aria-label={select.all} value={sp.get(select.param) ?? ""} onChange={(e) => go(select.param, e.target.value)} className={field}>
          <option value="">{select.all}</option>{select.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      )}
      {month && <input type="month" aria-label="Mês" value={sp.get("mes") ?? ""} onChange={(e) => go("mes", e.target.value)} className={field} />}
    </div>
  );
}
