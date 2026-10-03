import { ClientForm } from "@/features/clients/client-form";
import { createClientAction } from "@/features/clients/actions";

export default function NovoCliente() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Novo cliente</h1>
      <p className="mb-6 mt-1 text-muted">Preencha o básico. Você pode completar depois.</p>
      <ClientForm action={createClientAction} cancelHref="/clientes" />
    </div>
  );
}
