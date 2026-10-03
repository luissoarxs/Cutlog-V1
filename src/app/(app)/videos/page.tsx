import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UrlFilters } from "@/components/ui/url-filters";
import { listVideos } from "@/features/videos/queries";
import { VideoRow } from "@/features/videos/video-row";
import { STATUSES } from "@/features/videos/schema";

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const videos = await listVideos({ q, status });
  const filtering = !!(q || status);
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight">Vídeos</h1><p className="mt-1 text-muted">Todo o histórico do seu trabalho.</p></div>
        <Link href="/videos/novo" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg transition hover:opacity-90"><Plus className="size-4" />Novo vídeo</Link>
      </div>
      <Suspense><UrlFilters search="Buscar por título, fazenda, local ou cliente" tabs={[["", "Todos"], ...STATUSES]} /></Suspense>
      {videos.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">{filtering ? "Nenhum vídeo encontrado." : "Você ainda não possui vídeos."}</p>
          <p className="mt-1 text-sm text-muted">{filtering ? "Tente outro termo ou mude o filtro." : "Cadastre seu primeiro vídeo para começar."}</p>
          {!filtering && <Link href="/videos/novo" className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-brand-fg">+ Novo vídeo</Link>}
        </div>
      ) : <div className="mt-6 space-y-3">{videos.map((v) => <VideoRow key={v.id} v={v} showClient />)}</div>}
    </div>
  );
}
