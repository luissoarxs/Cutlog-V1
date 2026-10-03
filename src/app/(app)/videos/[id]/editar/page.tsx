import { notFound } from "next/navigation";
import { getVideo, formClients } from "@/features/videos/queries";
import { VideoForm } from "@/features/videos/video-form";
import { updateVideoAction } from "@/features/videos/actions";
import { dateBR } from "@/lib/format";

export default async function EditarVideo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await getVideo(id);
  if (!v) notFound();
  const pay = v.payments[0];
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Editar vídeo</h1>
      <VideoForm action={updateVideoAction.bind(null, id)} clients={await formClients()} video={v} clientId={v.client_id}
        amount={pay ? pay.amount.toFixed(2).replace(".", ",") : ""} due={pay?.due_date ?? ""}
        paidInfo={pay?.paid_at ? `Pagamento recebido em ${dateBR(pay.paid_at)}. Valor e data ficam bloqueados.` : undefined} cancelHref={`/videos/${id}`} />
    </div>
  );
}
