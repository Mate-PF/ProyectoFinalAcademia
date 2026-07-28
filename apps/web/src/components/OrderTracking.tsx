import type { OrderTrackingDTO } from "../api/client";
import { formatMoney } from "../format";
import { StatusBadge } from "./StatusBadge";

export interface OrderTrackingProps {
  tracking: OrderTrackingDTO;
}

export function OrderTracking({ tracking }: OrderTrackingProps) {
  return (
    <section aria-label="Seguimiento del pedido" className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-neutral-500">Pedido {tracking.orderId}</p>
      <StatusBadge status={tracking.status} />
      <p className="text-lg font-bold text-neutral-900">{formatMoney(tracking.total)}</p>
      {tracking.delivererId !== null && (
        <p className="text-sm text-neutral-600">Repartidor: {tracking.delivererId}</p>
      )}
    </section>
  );
}
