const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: "bg-neutral-100 text-neutral-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  EN_PREPARACION: "bg-amber-100 text-amber-700",
  EN_CAMINO: "bg-indigo-100 text-indigo-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

/** Badge de estado de pedido con color y etiqueta legible. */
export function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const style = STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-700";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${style}`}>{label}</span>
  );
}
