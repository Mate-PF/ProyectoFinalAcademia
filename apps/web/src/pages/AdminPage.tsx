import { useCallback, useEffect, useState } from "react";
import {
  api,
  type AuthUser,
  type MenuItemDTO,
  type OrderAction,
  type OrderDTO,
  type RestaurantDTO,
} from "../api/client";
import { useSession } from "../session/SessionContext";
import { RestaurantForm, type RestaurantFormValues } from "../components/RestaurantForm";
import { MenuItemForm, type MenuItemFormValues } from "../components/MenuItemForm";
import { MenuList } from "../components/MenuList";
import { OrderList } from "../components/OrderList";

const ADMIN_ACTIONS: Record<string, { label: string; action: OrderAction }[]> = {
  PENDIENTE: [
    { label: "Confirmar", action: "CONFIRM" },
    { label: "Cancelar", action: "CANCEL" },
  ],
  CONFIRMADO: [
    { label: "Preparar", action: "START_PREPARING" },
    { label: "Cancelar", action: "CANCEL" },
  ],
  EN_PREPARACION: [{ label: "Despachar", action: "DISPATCH" }],
};

const ASSIGNABLE = new Set(["CONFIRMADO", "EN_PREPARACION"]);

export function AdminPage() {
  const { token, user } = useSession();
  const [restaurant, setRestaurant] = useState<RestaurantDTO | null>(null);
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [deliverers, setDeliverers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const reloadMenu = useCallback(async (restaurantId: string) => {
    setMenu(await api.listMenu(restaurantId));
  }, []);

  const reloadOrders = useCallback(
    async (restaurantId: string) => {
      if (token === null) return;
      setOrders(await api.restaurantOrders(token, restaurantId));
    },
    [token],
  );

  const reloadDeliverers = useCallback(async () => {
    if (token === null) return;
    setDeliverers(await api.listDeliverers(token));
  }, [token]);

  useEffect(() => {
    if (user === null) return;
    let active = true;
    setLoading(true);
    api
      .listRestaurants()
      .then(async (all) => {
        if (!active) return;
        const mine = all.find((r) => r.ownerId === user.id) ?? null;
        setRestaurant(mine);
        if (mine !== null) {
          await reloadMenu(mine.id);
          await reloadOrders(mine.id);
          await reloadDeliverers();
        }
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "Error al cargar");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, reloadMenu, reloadOrders, reloadDeliverers]);

  if (token === null || user === null) return null;
  const authToken = token;

  async function handleCreateRestaurant(values: RestaurantFormValues) {
    setError(undefined);
    setSaving(true);
    try {
      const created = await api.createRestaurant(authToken, {
        name: values.name,
        address: { street: values.street, number: values.number, city: values.city, postalCode: values.postalCode },
      });
      setRestaurant(created);
      await reloadMenu(created.id);
      await reloadOrders(created.id);
      await reloadDeliverers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddItem(values: MenuItemFormValues) {
    if (restaurant === null) return;
    setError(undefined);
    setSaving(true);
    try {
      await api.addMenuItem(authToken, restaurant.id, { name: values.name, price: values.price, currency: "ARS" });
      await reloadMenu(restaurant.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al agregar");
    } finally {
      setSaving(false);
    }
  }

  async function handleOrderAction(orderId: string, action: OrderAction) {
    if (restaurant === null) return;
    setError(undefined);
    try {
      await api.changeOrderStatus(authToken, orderId, action);
      await reloadOrders(restaurant.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cambiar el estado");
    }
  }

  async function handleAssign(orderId: string, delivererId: string) {
    if (restaurant === null) return;
    setError(undefined);
    try {
      await api.assignDeliverer(authToken, orderId, delivererId);
      await reloadOrders(restaurant.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al asignar repartidor");
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-muted">Cargando…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-fg">Administrar restaurante</h2>
      {error !== undefined && <p className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>}
      {restaurant === null ? (
        <RestaurantForm onSubmit={handleCreateRestaurant} loading={saving} />
      ) : (
        <>
          <div className="rounded-2xl bg-surface p-6 shadow-sm">
            <p className="text-sm text-muted">Tu restaurante</p>
            <p className="text-lg font-bold text-fg">{restaurant.name}</p>
            <p className="text-sm text-muted">
              {restaurant.address.street} {restaurant.address.number}, {restaurant.address.city}
            </p>
          </div>

          <MenuItemForm onSubmit={handleAddItem} loading={saving} />

          <div>
            <h3 className="mb-3 text-lg font-bold text-fg">Menú actual</h3>
            <MenuList items={menu} emptyMessage="Todavía no cargaste ítems" />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold text-fg">Pedidos</h3>
            <OrderList
              orders={orders}
              emptyMessage="Todavía no hay pedidos"
              renderActions={(order) => (
                <>
                  {(ADMIN_ACTIONS[order.status] ?? []).map((a) => (
                    <button
                      key={a.action}
                      type="button"
                      onClick={() => void handleOrderAction(order.id, a.action)}
                      className="rounded-lg bg-accent px-3 py-1 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
                    >
                      {a.label}
                    </button>
                  ))}
                  {order.delivererId === null && ASSIGNABLE.has(order.status) && deliverers.length > 0 && (
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value !== "") void handleAssign(order.id, e.target.value);
                      }}
                      className="rounded-lg border border-border px-2 py-1 text-sm"
                    >
                      <option value="" disabled>
                        Asignar repartidor…
                      </option>
                      {deliverers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {order.delivererId !== null && (
                    <span className="self-center text-xs text-muted">Repartidor asignado</span>
                  )}
                </>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
