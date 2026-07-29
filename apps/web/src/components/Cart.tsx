import type { CartLine, Money } from "../api/client";
import { formatMoney } from "../format";

export interface CartProps {
  items: CartLine[];
  total: Money | null;
  onRemove?: (menuItemId: string) => void;
  onCheckout?: () => void;
  loading?: boolean;
}

export function Cart({ items, total, onRemove, onCheckout, loading = false }: CartProps) {
  if (loading) {
    return <p className="py-8 text-center text-muted">Cargando carrito…</p>;
  }
  if (items.length === 0) {
    return <p className="py-8 text-center text-muted">El carrito está vacío</p>;
  }
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm">
      <ul aria-label="Carrito" className="divide-y divide-border">
        {items.map((line) => (
          <li key={line.menuItemId} className="flex items-center gap-3 py-3">
            <span className="flex-1 font-medium text-fg">{line.name}</span>
            <span className="text-sm text-muted">×{line.quantity}</span>
            <span className="w-28 text-right font-medium tabular-nums">{formatMoney(line.subtotal)}</span>
            {onRemove !== undefined && (
              <button
                type="button"
                onClick={() => onRemove(line.menuItemId)}
                className="rounded-md px-2 py-1 text-sm text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Quitar
              </button>
            )}
          </li>
        ))}
      </ul>

      {total !== null && (
        <p className="mt-4 border-t border-border pt-4 text-right text-lg font-bold text-fg tabular-nums">
          Total: {formatMoney(total)}
        </p>
      )}

      {onCheckout !== undefined && (
        <button
          type="button"
          onClick={onCheckout}
          className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-accent-fg transition hover:bg-accent-hover"
        >
          Confirmar pedido
        </button>
      )}
    </div>
  );
}
