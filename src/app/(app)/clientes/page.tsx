import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listClients, loadStats } from "@/features/clients/queries";
import { SearchBox } from "@/features/clients/search-box";
import { brl, num } from "@/lib/format";

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const [clients, stats] = await Promise.all([listClients(q, status), loadStats()]);
  const filtering = !!(q || status);
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-muted">Gerencie seus clientes e acompanhe seus projetos.</p>
        </div>
        <Link href="/clientes/novo" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg transition hover:opacity-90"><Plus className="size-4" />Novo cliente</Link>
      </div>
      <Suspense><SearchBox /></Suspense>
      {clients.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">{filtering ? "Nenhum cliente encontrado." : "Você ainda não possui clientes."}</p>
          <p className="mt-1 text-sm text-muted">{filtering ? "Tente outro termo ou mude o filtro." : "Cadastre seu primeiro cliente para começar."}</p>
          {!filtering && <Link href="/clientes/novo" className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-brand-fg">+ Novo cliente</Link>}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => {
            const s = stats.get(c.id);
            return (
              <Link key={c.id} href={`/clientes/${c.id}`} className="rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="truncate text-lg font-semibold">{c.name}</p>{c.brand && <p className="truncate text-sm text-muted">{c.brand}</p>}</div>
                  {!c.active && <span className="rounded-full bg-bg px-2.5 py-0.5 text-xs text-muted">Inativo</span>}
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
                  <div><dt className="text-muted">Vídeos</dt><dd className="num text-base font-semibold">{num(s.videos)}</dd></div>
                  <div><dt className="text-muted">Visualizações</dt><dd className="num text-base font-semibold">{num(s.views)}</dd></div>
                  <div className="col-span-2"><dt className="text-muted">A receber</dt><dd className="num text-base font-semibold">{brl(s.pending)}</dd></div>
                </dl>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
