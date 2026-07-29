import type { MenuItemDTO } from "../api/client";
import { Skeleton } from "./Skeleton";
import { formatMoney } from "../format";

export interface MenuListProps {
  items: MenuItemDTO[];
  onAdd?: (menuItemId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function MenuList({ items, onAdd, loading = false, emptyMessage = "No hay ítems en el menú" }: MenuListProps) {
  if (loading) {
    return (
      <div aria-busy="true" className="space-y-3">
        <span className="sr-only">Cargando menú…</span>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl bg-surface p-4 shadow-sm">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
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
            <p className="text-sm text-muted tabular-nums">{formatMoney(item.price)}</p>
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
