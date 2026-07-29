import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type OrderDTO } from "../api/client";
import { useSession } from "../session/SessionContext";
import { OrderList } from "../components/OrderList";

export function MyOrdersPage() {
  const { token } = useSession();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token === null) return;
    let active = true;
    api
      .myOrders(token)
      .then((o) => {
        if (active) setOrders(o);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-fg">Mis pedidos</h2>
      <OrderList
        orders={orders}
        loading={loading}
        emptyMessage="Todavía no hiciste ningún pedido"
        renderActions={(order) => (
          <Link to={`/orders/${order.id}`} className="text-sm font-semibold text-accent hover:underline">
            Ver seguimiento →
          </Link>
        )}
      />
    </div>
  );
}
