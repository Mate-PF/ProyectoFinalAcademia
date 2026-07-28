import type { MenuItemDTO } from "../api/client";
import { formatMoney } from "../format";

export interface MenuListProps {
  items: MenuItemDTO[];
  onAdd?: (menuItemId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function MenuList({ items, onAdd, loading = false, emptyMessage = "No hay ítems en el menú" }: MenuListProps) {
  if (loading) {
    return <p className="py-8 text-center text-neutral-500">Cargando menú…</p>;
  }
  if (items.length === 0) {
    return <p className="py-8 text-center text-neutral-500">{emptyMessage}</p>;
  }
  return (
    <ul aria-label="Menú" className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex-1">
            <p className="font-medium text-neutral-900">{item.name}</p>
            <p className="text-sm text-neutral-500">{formatMoney(item.price)}</p>
          </div>
          {onAdd !== undefined && (
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              disabled={!item.available}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              {item.available ? "Agregar" : "No disponible"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
