import { notFound } from "next/navigation";
import { ClientForm } from "@/features/clients/client-form";
import { updateClientAction } from "@/features/clients/actions";
import { getClient } from "@/features/clients/queries";

export default async function EditarCliente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getClient(id);
  if (!c) notFound();
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Editar cliente</h1>
      <ClientForm action={updateClientAction.bind(null, id)} client={c} cancelHref={`/clientes/${id}`} />
    </div>
  );
}
