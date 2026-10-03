"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { brand } from "@/config/brand";
import { nav } from "./nav";

export function MobileChrome() {
  const path = usePathname();
  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur md:hidden">
        <span className="flex items-center gap-2 font-semibold">
          <img
  src={brand.logoMark}
  alt="Cutlog"
  className="h-10 w-auto object-contain"
/>
        </span>
        <Link href="/configuracoes" aria-label="Configurações" className="grid size-10 place-items-center text-muted"><Settings className="size-5" /></Link>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {nav.slice(0, 5).map(({ href, short, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? "text-brand" : "text-muted"}`}>
              <Icon className="size-5" />{short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
