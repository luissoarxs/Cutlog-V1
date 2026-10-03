import { Suspense } from "react";
import Link from "next/link";
import { Stat } from "@/components/ui/stat";
import { UrlFilters } from "@/components/ui/url-filters";
import { loadResults } from "@/features/metrics/queries";
import { ChartCard } from "@/features/dashboard/charts";
import { num } from "@/lib/format";

export default async function Resultados({ searchParams }: { searchParams: Promise<{ cliente?: string; periodo?: string }> }) {
  const f = await searchParams;
  const r = await loadResults(f);
  const max = r.top[0]?.views || 1;
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Resultados</h1>
      <p className="mt-1 text-muted">O impacto dos vídeos que você editou.</p>
      <Suspense><UrlFilters tabParam="periodo" tabs={[["", "Tudo"], ["30d", "30 dias"], ["90d", "90 dias"], ["ano", "Este ano"]]} select={{ param: "cliente", all: "Todos os clientes", options: r.clients.map((c) => [c.id, c.name] as const) }} /></Suspense>
      <div className="mt-6 grid grid-cols-2 gap-4"><Stat label="Vídeos editados" value={r.videos} /><Stat label="Visualizações" value={r.views} /></div>
      <div className="mt-4"><ChartCard title="Visualizações ao longo do tempo" hint="Por mês de cadastro do vídeo" data={r.series} type="area" /></div>
      <section className="mt-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium">Vídeos com mais visualizações</h2>
        {r.top.length === 0 ? (
          <div className="py-10 text-center"><p className="font-medium">Nenhuma visualização registrada.</p><p className="mt-1 text-sm text-muted">Informe as visualizações na página de cada vídeo.</p><Link href="/videos" className="mt-4 inline-block text-sm text-brand">Ver vídeos</Link></div>
        ) : (
          <ul className="space-y-4">
            {r.top.map((v) => (
              <li key={v.id}>
                <div className="flex items-baseline justify-between gap-3"><Link href={`/videos/${v.id}`} className="truncate font-medium transition hover:text-brand">{v.title}<span className="ml-2 text-sm font-normal text-muted">{v.clients?.name}</span></Link><span className="num shrink-0 text-sm">{num(v.views)}</span></div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(3, (v.views / max) * 100)}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
