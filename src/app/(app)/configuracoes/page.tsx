import { brand } from "@/config/brand";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../../(auth)/login/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default async function Configuracoes() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  const card = "flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5";
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
      <div className={card}><div><p className="font-medium">Conta</p><p className="text-sm text-muted">{user?.email}</p></div></div>
      <div className={card}><div><p className="font-medium">Tema</p><p className="text-sm text-muted">Alterne entre claro e escuro.</p></div><ThemeToggle /></div>
      <div className={card}><div><p className="font-medium">{brand.name}</p><p className="text-sm text-muted">Nome, logo e cor ficam em src/config/brand.ts.</p></div></div>
      <form action={logout}><button className="h-11 rounded-lg border border-border px-5 text-sm font-medium text-danger transition hover:bg-surface">Sair da conta</button></form>
    </div>
  );
}
