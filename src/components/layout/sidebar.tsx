"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { brand } from "@/config/brand";
import { nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar({ email, logout }: { email: string; logout: () => Promise<void> }) {
  const path = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface p-4 md:flex">
<div className="mb-8 flex items-center justify-center pt-2">
  <img
    src={brand.logoMark}
    alt="Cutlog"
    className="h-20 w-auto object-contain"
  />
</div>
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${active ? "bg-brand/10 text-brand" : "text-muted hover:bg-bg hover:text-fg"}`}>
              <Icon className="size-[18px]" />{label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <p className="truncate px-2 text-xs text-muted" title={email}>{email}</p>
        <ThemeToggle />
        <form action={logout}>
          <button aria-label="Sair" className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-bg hover:text-danger"><LogOut className="size-4" /></button>
        </form>
      </div>
    </aside>
  );
}
