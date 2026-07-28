import type { MenuItemDTO } from "../api/client";

export interface MenuListProps {
  items: MenuItemDTO[];
  onAdd?: (menuItemId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

/** Lista el menú de un restaurante. Componente de presentación (sin red). */
export function MenuList({
  items,
  onAdd,
  loading = false,
  emptyMessage = "No hay ítems en el menú",
}: MenuListProps) {
  if (loading) {
    return <p>Cargando menú…</p>;
  }
  if (items.length === 0) {
    return <p>{emptyMessage}</p>;
  }
  return (
    <ul aria-label="Menú">
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.name}</span>
          <span>{formatPrice(item.price)}</span>
          {onAdd !== undefined && (
            <button type="button" onClick={() => onAdd(item.id)} disabled={!item.available}>
              {item.available ? "Agregar" : "No disponible"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function formatPrice(price: { amount: number; currency: string }): string {
  return `${price.currency} ${price.amount.toFixed(2)}`;
}
