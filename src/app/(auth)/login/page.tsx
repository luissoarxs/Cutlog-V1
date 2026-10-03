import { brand } from "@/config/brand";
import { login } from "./actions";

export default async function LoginPage({ searchParams }: Readonly<{ searchParams: Promise<{ erro?: string }> }>) {
  const { erro } = await searchParams;
  const field = "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand";
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7">
        <div className="mb-8 flex items-center gap-3">
      <img
  src="/cutlog-logo.png"
  alt="Cutlog"
  className="h-10 w-auto object-contain"
/>
          <div>
            <h1 className="text-xl font-semibold leading-tight">{brand.name}</h1>
            <p className="text-sm text-muted">Entre para ver seu painel.</p>
          </div>
        </div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
        <label className="mb-1.5 mt-4 block text-sm font-medium" htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={field} />
        {erro && <p role="alert" className="mt-3 text-sm text-danger">E-mail ou senha incorretos. Confira e tente de novo.</p>}
        <button type="submit" className="mt-6 h-11 w-full rounded-lg bg-brand font-medium text-brand-fg transition hover:opacity-90 active:scale-[.99]">Entrar</button>
        <p className="mt-4 text-center text-xs text-muted">Sua sessão continua ativa neste aparelho.</p>
      </form>
    </main>
  );
}
