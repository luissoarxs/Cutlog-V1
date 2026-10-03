import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { getClient, loadStats } from "@/features/clients/queries";
import { ClientActions } from "@/features/clients/client-actions";
import { listVideos } from "@/features/videos/queries";
import { VideoRow } from "@/features/videos/video-row";
import { brl, dateBR, num } from "@/lib/format";

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getClient(id);
  if (!c) notFound();
  const s = (await loadStats(id)).get(id);
  const videos = await listVideos({ clientId: id });
  const card = "rounded-2xl border border-border bg-surface p-5";
  const kpis: [string, string, string?][] = [
    ["Vídeos", num(s.videos)], ["Faturado", brl(s.billed)], ["Recebido", brl(s.received), "text-success"],
    ["A receber", brl(s.pending)], ["Visualizações", num(s.views)],
    ["Pagamento", c.payment_day ? `Todo dia ${c.payment_day}` : "Não definido"],
  ];
  return (
    <div>
      <Link href="/clientes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"><ArrowLeft className="size-4" />Clientes</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{c.name}</h1>
            <span className="inline-flex items-center gap-2 text-sm"><span className={`size-2 rounded-full ${c.active ? "bg-success" : "bg-muted"}`} />{c.active ? "Ativo" : "Inativo"}</span>
          </div>
          {c.brand && <p className="mt-1 text-muted">{c.brand}</p>}
        </div>
        <div className="flex gap-2">
          <Link href={`/clientes/${id}/editar`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-bg"><Pencil className="size-4" />Editar</Link>
          <ClientActions id={id} active={c.active} hasVideos={s.videos > 0} />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpis.map(([l, v, cls]) => <div key={l} className={card}><p className="text-sm text-muted">{l}</p><p className={`num mt-1.5 text-2xl font-semibold ${cls ?? ""}`}>{v}</p></div>)}
      </div>
      <div className={`${card} mt-4 grid gap-3 text-sm sm:grid-cols-2`}>
        <p><span className="text-muted">Telefone </span>{c.phone ? <a className="text-brand" href={`tel:${c.phone}`}>{c.phone}</a> : "—"}</p>
        <p><span className="text-muted">E-mail </span>{c.email ? <a className="text-brand" href={`mailto:${c.email}`}>{c.email}</a> : "—"}</p>
        <p><span className="text-muted">Valor padrão por vídeo </span>{brl(c.default_video_price)}</p>
        <p><span className="text-muted">Cliente desde </span>{dateBR(c.created_at)}</p>
        {c.notes && <p className="sm:col-span-2"><span className="text-muted">Observações </span>{c.notes}</p>}
      </div>
      <div className="mb-4 mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vídeos do cliente</h2>
        <Link href={`/videos/novo?cliente=${id}`} className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg transition hover:opacity-90">+ Novo vídeo</Link>
      </div>
      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center">
          <p className="font-medium">Nenhum vídeo cadastrado ainda.</p>
          <p className="mt-1 text-sm text-muted">Cadastre o primeiro vídeo deste cliente.</p>
          <Link href={`/videos/novo?cliente=${id}`} className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-brand-fg">+ Novo vídeo</Link>
        </div>
      ) : <div className="space-y-3">{videos.map((v) => <VideoRow key={v.id} v={v} />)}</div>}
    </div>
  );
}
