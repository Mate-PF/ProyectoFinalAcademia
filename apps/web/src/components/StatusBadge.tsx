const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: "bg-neutral-100 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300",
  CONFIRMADO: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  EN_PREPARACION: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  EN_CAMINO: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  ENTREGADO: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  CANCELADO: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

/** Badge de estado de pedido con color y etiqueta legible (claro/oscuro). */
export function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const style = STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${style}`}>{label}</span>
  );
}
