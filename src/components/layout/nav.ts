import { LayoutDashboard, Users, Clapperboard, Wallet, BarChart3, Settings } from "lucide-react";
export const nav = [
  { href: "/dashboard", label: "Dashboard", short: "Início", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", short: "Clientes", icon: Users },
  { href: "/videos", label: "Vídeos", short: "Vídeos", icon: Clapperboard },
  { href: "/carteira", label: "Carteira", short: "Carteira", icon: Wallet },
  { href: "/resultados", label: "Resultados", short: "Resultados", icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", short: "Config", icon: Settings },
] as const;
