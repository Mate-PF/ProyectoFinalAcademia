import type { ReactNode } from "react";
import type { OrderDTO } from "../api/client";
import { formatMoney } from "../format";
import { StatusBadge } from "./StatusBadge";

export interface OrderListProps {
  orders: OrderDTO[];
  loading?: boolean;
  emptyMessage?: string;
  renderActions?: (order: OrderDTO) => ReactNode;
}

/** Lista de pedidos con estado y total. Las acciones (botones) las inyecta la página. */
export function OrderList({ orders, loading = false, emptyMessage = "No hay pedidos", renderActions }: OrderListProps) {
  if (loading) {
    return <p className="py-8 text-center text-neutral-500">Cargando pedidos…</p>;
  }
  if (orders.length === 0) {
    return <p className="py-8 text-center text-neutral-500">{emptyMessage}</p>;
  }
  return (
    <ul aria-label="Pedidos" className="space-y-3">
      {orders.map((order) => (
        <li key={order.id} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">#{order.id.slice(0, 8)}</p>
              <p className="text-sm text-neutral-600">
                {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={order.status} />
              <span className="font-medium">{formatMoney(order.total)}</span>
            </div>
          </div>
          {renderActions !== undefined && (
            <div className="mt-3 flex flex-wrap gap-2">{renderActions(order)}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
