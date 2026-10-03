"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const msgs: Record<string, [("success" | "error"), string]> = {
  criado: ["success", "Cliente salvo com sucesso."],
  atualizado: ["success", "Cliente atualizado."],
  inativado: ["success", "Cliente inativado. O histórico foi mantido."],
  reativado: ["success", "Cliente reativado."],
  excluido: ["success", "Cliente excluído."],
  video_criado: ["success", "Vídeo salvo com sucesso."],
  video_atualizado: ["success", "Vídeo atualizado."],
  video_excluido: ["success", "Vídeo excluído."],
  erro: ["error", "Não foi possível concluir a ação."],
  erro_excluir: ["error", "Não foi possível excluir. Se o cliente tem vídeos, inative-o."],
};
// Mostra um toast a partir de ?ok=... e limpa a URL.
export function Flash() {
  const sp = useSearchParams(), router = useRouter(), path = usePathname();
  const ok = sp.get("ok");
  useEffect(() => {
    if (!ok || !msgs[ok]) return;
    const [kind, text] = msgs[ok];
    toast[kind](text);
    const next = new URLSearchParams(sp); next.delete("ok");
    router.replace(next.size ? `${path}?${next}` : path);
  }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
