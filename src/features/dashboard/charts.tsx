"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { brl, num } from "@/lib/format";

type P = { label: string; value: number };
export function ChartCard({ title, hint, data, type }: { title: string; hint?: string; data: P[]; type: "area" | "bar" }) {
  const tick = { fill: "var(--muted)", fontSize: 12 };
  const fmt = (v: unknown) => (type === "bar" ? brl(Number(v)) : num(Number(v)));
  const tip = { contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--fg)", fontSize: 13 }, cursor: { stroke: "var(--border)" }, formatter: (v: unknown) => [fmt(v), ""] as [string, string], labelStyle: { color: "var(--muted)" } };
  return (
    <section className="rise rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-medium">{title}</h2>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {data.length === 0 ? <p className="py-16 text-center text-sm text-muted">Sem dados ainda.</p> : (
        <div className="mt-4 h-60 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--brand)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tip} />
                <Area type="monotone" dataKey="value" stroke="var(--brand)" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} />
                <Tooltip {...tip} cursor={{ fill: "var(--border)", opacity: 0.4 }} />
                <Bar dataKey="value" fill="var(--brand)" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
