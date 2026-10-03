import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { StatusDot } from "@/components/ui/status-dot";
import { brl, dateBR, num, payStatus } from "@/lib/format";
import { statusLabel } from "./schema";
import type { VideoRow as V } from "./queries";

export function VideoRow({ v, showClient }: { v: V; showClient?: boolean }) {
  const pay = v.payments[0];
  const sub = [showClient && v.clients?.name, v.property, v.location].filter(Boolean).join(" · ");
  return (
    <div className="rise grid gap-3 rounded-2xl border border-border bg-surface p-4 transition hover:border-brand/40 md:grid-cols-[minmax(0,2fr)_9rem_9rem_6rem_5.5rem] md:items-center">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/videos/${v.id}`} className="truncate font-medium transition hover:text-brand">{v.title}</Link>
          {v.drive_url && <a href={v.drive_url} target="_blank" rel="noopener noreferrer" aria-label="Abrir Drive" className="shrink-0 text-muted transition hover:text-brand"><ExternalLink className="size-4" /></a>}
        </div>
        {sub && <p className="truncate text-sm text-muted">{sub}</p>}
      </div>
      <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${v.status === "publicado" ? "bg-success/10 text-success" : "bg-bg text-muted"}`}>{statusLabel[v.status]}</span>
      {pay ? <div><p className="num font-medium">{brl(pay.amount)}</p><StatusDot status={payStatus(pay)} /></div> : <p className="text-sm text-muted">Sem pagamento</p>}
      <p className="num text-sm"><span className="text-muted md:hidden">Views </span>{num(v.views)}</p>
      <p className="text-sm text-muted">{dateBR(v.created_at)}</p>
    </div>
  );
}
