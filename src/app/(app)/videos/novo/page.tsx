import Link from "next/link";
import { formClients } from "@/features/videos/queries";
import { VideoForm } from "@/features/videos/video-form";
import { createVideoAction } from "@/features/videos/actions";
import { nextDue } from "@/features/videos/schema";

export default async function NovoVideo({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams;
  const clients = await formClients();
  if (clients.length === 0) return (
    <div className="rounded-2xl border border-dashed border-border py-16 text-center">
      <p className="font-medium">Você ainda não possui clientes ativos.</p>
      <p className="mt-1 text-sm text-muted">Cadastre um cliente antes de adicionar vídeos.</p>
      <Link href="/clientes/novo" className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-brand-fg">+ Novo cliente</Link>
    </div>
  );
  const c = clients.find((x) => x.id === cliente);
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Novo vídeo</h1>
      <p className="mb-6 mt-1 text-muted">{c ? `Para ${c.name}.` : "Escolha o cliente e preencha o básico."}</p>
      <VideoForm action={createVideoAction} clients={clients} clientId={c?.id ?? ""} amount={c && c.price > 0 ? c.price.toFixed(2).replace(".", ",") : ""} due={nextDue(c?.day ?? null)} cancelHref={c ? `/clientes/${c.id}` : "/videos"} />
    </div>
  );
}
