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
    return <p className="py-8 text-center text-muted">Cargando menú…</p>;
  }
  if (items.length === 0) {
    return <p className="py-8 text-center text-muted">{emptyMessage}</p>;
  }
  return (
    <ul aria-label="Menú" className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 rounded-xl bg-surface p-4 shadow-sm">
          <div className="flex-1">
            <p className="font-medium text-fg">{item.name}</p>
            <p className="text-sm text-muted">{formatMoney(item.price)}</p>
          </div>
          {onAdd !== undefined && (
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              disabled={!item.available}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {item.available ? "Agregar" : "No disponible"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
