import type { OrderTrackingDTO } from "../api/client";
import { formatMoney } from "../format";

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

export interface OrderTrackingProps {
  tracking: OrderTrackingDTO;
}

export function OrderTracking({ tracking }: OrderTrackingProps) {
  const label = STATUS_LABELS[tracking.status] ?? tracking.status;
  const badgeStyle = STATUS_STYLES[tracking.status] ?? "bg-neutral-100 text-neutral-700";

  return (
    <section aria-label="Seguimiento del pedido" className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-neutral-500">Pedido {tracking.orderId}</p>
      <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${badgeStyle}`}>{label}</span>
      <p className="text-lg font-bold text-neutral-900">{formatMoney(tracking.total)}</p>
      {tracking.delivererId !== null && (
        <p className="text-sm text-neutral-600">Repartidor: {tracking.delivererId}</p>
      )}
    </section>
  );
}
