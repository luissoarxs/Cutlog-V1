import { Suspense } from "react";
import Link from "next/link";
import { Stat } from "@/components/ui/stat";
import { StatusDot } from "@/components/ui/status-dot";
import { UrlFilters } from "@/components/ui/url-filters";
import { loadWallet } from "@/features/payments/queries";
import { PayButton } from "@/features/payments/pay-button";
import { brl, dateBR, dateOnly, payStatus } from "@/lib/format";

export default async function Carteira({ searchParams }: { searchParams: Promise<{ status?: string; cliente?: string; mes?: string }> }) {
  const f = await searchParams;
  const { totals, rows } = await loadWallet(f);
  const clients = [...new Map(rows.map((r) => [r.client_id, r.clients?.name ?? ""])).entries()];
  const all = (await loadWallet({})).rows;
  const options = [...new Map(all.map((r) => [r.client_id, r.clients?.name ?? ""])).entries()] as [string, string][];
  void clients;
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Carteira</h1>
      <p className="mt-1 text-muted">O dinheiro do seu trabalho, em tempo real.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Recebido" value={totals.received} kind="brl" tone="success" />
        <Stat label="A receber" value={totals.pending} kind="brl" />
        <Stat label="Atrasado" value={totals.overdue} kind="brl" tone="danger" hint="Já vencido, incluso em A receber" />
        <Stat label="Faturado" value={totals.billed} kind="brl" />
      </div>
      <Suspense><UrlFilters tabs={[["", "Todos"], ["pendente", "Pendentes"], ["pago", "Pagos"], ["atrasado", "Atrasados"]]} select={{ param: "cliente", all: "Todos os clientes", options }} month /></Suspense>
      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">{f.status || f.cliente || f.mes ? "Nenhuma movimentação encontrada." : "Nenhuma movimentação ainda."}</p>
          <p className="mt-1 text-sm text-muted">Ao cadastrar um vídeo com valor e data, o pagamento aparece aqui.</p>
          <Link href="/videos/novo" className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-brand-fg">+ Novo vídeo</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((p) => {
            const s = payStatus(p);
            return (
              <div key={p.id} className="rise grid gap-2 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.4fr)_7.5rem_9rem_9rem] md:items-center md:gap-3">
                <p className="text-sm"><span className="text-muted md:hidden">Vence </span>{dateOnly(p.due_date)}</p>
                <p className="truncate font-medium">{p.clients?.name}</p>
                <Link href={`/videos/${p.videos?.id}`} className="truncate text-sm text-muted transition hover:text-brand">{p.videos?.title}</Link>
                <p className={`num font-semibold ${s === "pago" ? "text-success" : ""}`}>{brl(p.amount)}</p>
                <div><StatusDot status={s} />{p.paid_at && <p className="text-xs text-muted">em {dateBR(p.paid_at)}</p>}</div>
                <div className="md:text-right"><PayButton id={p.id} paid={!!p.paid_at} /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
