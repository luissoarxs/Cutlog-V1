import { AnimatedNumber } from "./animated-number";
export function Stat({ label, value, kind = "int", tone, hint }: { label: string; value: number; kind?: "int" | "brl"; tone?: "success" | "danger"; hint?: string }) {
  const color = tone === "success" ? "text-success" : tone === "danger" && value > 0 ? "text-danger" : "";
  const glow = tone === "success" ? "dark:shadow-[0_0_32px_-14px_var(--success)]" : "";
  return (
    <div className={`rise rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand/40 ${glow}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold md:text-3xl ${color}`}><AnimatedNumber value={value} kind={kind} /></p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
