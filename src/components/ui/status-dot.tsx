const map = {
  pago: ["bg-success", "Pago"],
  pendente: ["bg-warning", "Pendente"],
  atrasado: ["bg-danger", "Atrasado"],
} as const;
export function StatusDot({ status }: { status: keyof typeof map }) {
  const [color, label] = map[status];
  return <span className="inline-flex items-center gap-2 text-sm"><span className={`size-2 rounded-full ${color}`} />{label}</span>;
}
