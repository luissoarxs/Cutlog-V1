"use client";
import { useEffect, useState } from "react";

type Props = { value: number; kind?: "int" | "brl"; duration?: number; className?: string };

// Efeito counter: conta de 0 até o valor ao montar a tela.
export function AnimatedNumber({ value, kind = "int", duration = 900, className }: Props) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(value);
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const text = kind === "brl"
    ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : Math.round(n).toLocaleString("pt-BR");
  return <span className={`num ${className ?? ""}`}>{text}</span>;
}
