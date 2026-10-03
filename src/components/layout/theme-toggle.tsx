"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button aria-label="Alternar tema" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-bg hover:text-fg">
      <Sun className="size-4 dark:hidden" /><Moon className="hidden size-4 dark:block" />
    </button>
  );
}
