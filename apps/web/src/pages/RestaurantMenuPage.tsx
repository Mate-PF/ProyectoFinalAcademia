import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type MenuItemDTO } from "../api/client";
import { MenuList } from "../components/MenuList";
import { useCart } from "../cart/CartContext";

export function RestaurantMenuPage() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    if (id === undefined) return;
    let active = true;
    api
      .listMenu(id)
      .then((m) => {
        if (active) setMenu(m);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleAdd(menuItemId: string) {
    await add(menuItemId, 1);
    const item = menu.find((m) => m.id === menuItemId);
    setNotice(`${item?.name ?? "Ítem"} agregado al carrito`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Menú</h2>
      {notice !== undefined && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>
      )}
      <MenuList
        items={menu}
        onAdd={(mid) => void handleAdd(mid)}
        loading={loading}
        emptyMessage="Este restaurante no tiene ítems todavía"
      />
    </div>
  );
}
