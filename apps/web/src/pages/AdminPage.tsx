import { useCallback, useEffect, useState } from "react";
import { api, type MenuItemDTO, type RestaurantDTO } from "../api/client";
import { useSession } from "../session/SessionContext";
import { RestaurantForm, type RestaurantFormValues } from "../components/RestaurantForm";
import { MenuItemForm, type MenuItemFormValues } from "../components/MenuItemForm";
import { MenuList } from "../components/MenuList";

export function AdminPage() {
  const { token, user } = useSession();
  const [restaurant, setRestaurant] = useState<RestaurantDTO | null>(null);
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const reloadMenu = useCallback(async (restaurantId: string) => {
    setMenu(await api.listMenu(restaurantId));
  }, []);

  useEffect(() => {
    if (user === null) {
      return;
    }
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
  }, [user, reloadMenu]);

  if (token === null || user === null) {
    return null;
  }
  const authToken = token;

  async function handleCreateRestaurant(values: RestaurantFormValues) {
    setError(undefined);
    setSaving(true);
    try {
      const created = await api.createRestaurant(authToken, {
        name: values.name,
        address: {
          street: values.street,
          number: values.number,
          city: values.city,
          postalCode: values.postalCode,
        },
      });
      setRestaurant(created);
      await reloadMenu(created.id);
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
      await api.addMenuItem(authToken, restaurant.id, {
        name: values.name,
        price: values.price,
        currency: "ARS",
      });
      await reloadMenu(restaurant.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al agregar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-neutral-500">Cargando…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Administrar restaurante</h2>
      {restaurant === null ? (
        <RestaurantForm onSubmit={handleCreateRestaurant} error={error} loading={saving} />
      ) : (
        <>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Tu restaurante</p>
            <p className="text-lg font-bold text-neutral-900">{restaurant.name}</p>
            <p className="text-sm text-neutral-500">
              {restaurant.address.street} {restaurant.address.number}, {restaurant.address.city}
            </p>
          </div>
          <MenuItemForm onSubmit={handleAddItem} error={error} loading={saving} />
          <div>
            <h3 className="mb-3 text-lg font-bold text-neutral-900">Menú actual</h3>
            <MenuList items={menu} emptyMessage="Todavía no cargaste ítems" />
          </div>
        </>
      )}
    </div>
  );
}
