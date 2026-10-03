import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { getVideo } from "@/features/videos/queries";
import { StatusSelect, ViewsForm } from "@/features/videos/controls";
import { deleteVideoAction } from "@/features/videos/actions";
import { PayButton } from "@/features/payments/pay-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusDot } from "@/components/ui/status-dot";
import { brl, dateBR, dateOnly, payStatus } from "@/lib/format";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await getVideo(id);
  if (!v) notFound();
  const pay = v.payments[0];
  const card = "rounded-2xl border border-border bg-surface p-5";
  const row = (l: string, t?: string | null) => t ? <p><span className="text-muted">{l} </span>{t}</p> : null;
  return (
    <div className="max-w-4xl">
      <Link href={`/clientes/${v.client_id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"><ArrowLeft className="size-4" />{v.clients?.name}</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight">{v.title}</h1><p className="mt-1 text-muted">{[v.property, v.location].filter(Boolean).join(" · ") || "Sem detalhes de local"}</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusSelect id={id} status={v.status} />
          {v.drive_url
            ? <a href={v.drive_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg transition hover:opacity-90"><ExternalLink className="size-4" />Abrir Drive</a>
            : <span className="inline-flex h-10 items-center rounded-lg border border-dashed border-border px-4 text-sm text-muted">Sem link do Drive</span>}
          <Link href={`/videos/${id}/editar`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-bg"><Pencil className="size-4" />Editar</Link>
          <ConfirmDialog label="Excluir" title="Excluir este vídeo?" text="O vídeo e o pagamento ligado a ele serão removidos. Essa ação não pode ser desfeita." confirm="Excluir vídeo" action={deleteVideoAction.bind(null, id)} />
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className={card}>
          <h2 className="mb-3 font-medium">Financeiro</h2>
          {pay ? (
            <div className="space-y-2">
              <p className={`num text-3xl font-semibold ${pay.paid_at ? "text-success" : ""}`}>{brl(pay.amount)}</p>
              <p className="flex items-center gap-3 text-sm"><StatusDot status={payStatus(pay)} /><span className="text-muted">Vence {dateOnly(pay.due_date)}</span></p>
              {pay.paid_at && <p className="text-sm text-muted">Recebido em {dateBR(pay.paid_at)}</p>}
              <div className="pt-2"><PayButton id={pay.id} paid={!!pay.paid_at} /></div>
            </div>
          ) : <p className="text-sm text-muted">Sem pagamento. Edite o vídeo para informar valor e data.</p>}
        </section>
        <section className={card}>
          <h2 className="mb-3 font-medium">Visualizações</h2>
          <ViewsForm id={id} views={v.views} />
          <p className="mt-2 text-xs text-muted">Atualize quando quiser; o total vai para Resultados.</p>
        </section>
      </div>
      <section className={`${card} mt-4 space-y-2 text-sm`}>
        {row("Cliente", v.clients?.name)}{row("Descrição", v.description)}{row("Observações", v.notes)}
        {row("Cadastrado em", dateBR(v.created_at))}{row("Publicado em", v.published_at && dateOnly(v.published_at))}
      </section>
    </div>
  );
}
