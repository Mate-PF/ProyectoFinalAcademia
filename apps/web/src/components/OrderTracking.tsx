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

export interface OrderTrackingProps {
  tracking: OrderTrackingDTO;
}

/** Muestra el estado y total de un pedido. */
export function OrderTracking({ tracking }: OrderTrackingProps) {
  return (
    <section aria-label="Seguimiento del pedido">
      <p>Pedido: {tracking.orderId}</p>
      <p>
        Estado: <strong>{STATUS_LABELS[tracking.status] ?? tracking.status}</strong>
      </p>
      <p>Total: {formatMoney(tracking.total)}</p>
      {tracking.delivererId !== null && <p>Repartidor: {tracking.delivererId}</p>}
    </section>
  );
}
