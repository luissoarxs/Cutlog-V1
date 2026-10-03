import Link from "next/link";
import { brand } from "@/config/brand";
import { Stat } from "@/components/ui/stat";
import { StatusDot } from "@/components/ui/status-dot";
import { loadDashboard } from "@/features/dashboard/queries";
import { ChartCard } from "@/features/dashboard/charts";
import { brl, dateOnly, dateTime, payStatus } from "@/lib/format";

export default async function Dashboard() {
  const d = await loadDashboard();
  const h = "mb-3 mt-8 text-sm font-medium text-muted";
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Olá, {brand.owner} 👋</h1>
      <p className="mt-1 text-muted">Veja como está seu trabalho hoje.</p>
      <h2 className={h}>Financeiro</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Recebido" value={d.totals.received} kind="brl" tone="success" />
        <Stat label="A receber" value={d.totals.pending} kind="brl" />
        <Stat label="Atrasado" value={d.totals.overdue} kind="brl" tone="danger" hint="Já vencido, incluso em A receber" />
        <Stat label="Faturado" value={d.totals.billed} kind="brl" />
      </div>
      <h2 className={h}>Produção</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Vídeos editados" value={d.prod.edited} hint={`${d.videos} no total`} />
        <Stat label="Em edição" value={d.prod.editing} />
        <Stat label="Prontos para postar" value={d.prod.ready} />
        <Stat label="Publicados" value={d.prod.published} />
      </div>
      <h2 className={h}>Resultados</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Visualizações" value={d.views} hint="Soma de todos os clientes" />
        <Stat label="Clientes cadastrados" value={d.clients} />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Visualizações" hint="Por mês de cadastro do vídeo" data={d.viewsSeries} type="area" />
        <ChartCard title="Faturamento" hint="Por mês de vencimento" data={d.billingSeries} type="bar" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Próximos pagamentos</h2>
          {d.upcoming.length === 0 ? <p className="py-8 text-center text-sm text-muted">Nenhum pagamento em aberto.</p> : (
            <ul className="divide-y divide-border">
              {d.upcoming.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0"><p className="truncate font-medium">{p.clients?.name}</p><p className="truncate text-sm text-muted">{p.videos?.title}</p></div>
                  <div className="shrink-0 text-right"><p className="num font-medium">{brl(p.amount)}</p><p className="flex items-center justify-end gap-2 text-xs text-muted"><StatusDot status={payStatus(p)} />{dateOnly(p.due_date)}</p></div>
                </li>
              ))}
            </ul>
          )}
          <Link href="/carteira" className="mt-3 inline-block text-sm text-brand">Ver carteira</Link>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Atividade recente</h2>
          {d.activity.length === 0 ? <p className="py-8 text-center text-sm text-muted">Suas ações aparecem aqui.</p> : (
            <ul className="space-y-3">{d.activity.map((a) => <li key={a.id} className="flex justify-between gap-3 text-sm"><span>{a.message}</span><span className="shrink-0 text-muted">{dateTime(a.created_at)}</span></li>)}</ul>
          )}
        </section>
      </div>
    </div>
  );
}
