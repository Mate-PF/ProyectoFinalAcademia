import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type OrderTrackingDTO } from "../api/client";
import { OrderTracking } from "../components/OrderTracking";
import { useSession } from "../session/SessionContext";

export function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useSession();
  const [tracking, setTracking] = useState<OrderTrackingDTO | null>(null);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    if (id === undefined || token === null) return;
    try {
      setTracking(await api.trackOrder(token, id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el pedido");
    }
  }, [id, token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error !== undefined) return <p className="py-8 text-center text-red-600">{error}</p>;
  if (tracking === null) return <p className="py-8 text-center text-neutral-500">Cargando pedido…</p>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Tu pedido</h2>
      <OrderTracking tracking={tracking} />
      <button
        type="button"
        onClick={() => void load()}
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-700 transition hover:bg-neutral-50"
      >
        Actualizar estado
      </button>
    </div>
  );
}
