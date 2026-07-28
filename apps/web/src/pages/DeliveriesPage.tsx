import { useCallback, useEffect, useState } from "react";
import { api, type OrderDTO } from "../api/client";
import { useSession } from "../session/SessionContext";
import { OrderList } from "../components/OrderList";

export function DeliveriesPage() {
  const { token } = useSession();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    if (token === null) return;
    setLoading(true);
    try {
      setOrders(await api.deliveries(token));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function markDelivered(orderId: string) {
    if (token === null) return;
    setError(undefined);
    try {
      await api.changeOrderStatus(token, orderId, "DELIVER");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Mis entregas</h2>
      {error !== undefined && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <OrderList
        orders={orders}
        loading={loading}
        emptyMessage="No tenés entregas asignadas"
        renderActions={(order) =>
          order.status === "EN_CAMINO" ? (
            <button
              type="button"
              onClick={() => void markDelivered(order.id)}
              className="rounded-lg bg-brand px-3 py-1 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Marcar entregado
            </button>
          ) : null
        }
      />
    </div>
  );
}
