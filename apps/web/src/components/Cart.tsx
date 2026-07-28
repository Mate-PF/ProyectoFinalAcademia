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
    return <p className="py-8 text-center text-neutral-500">Cargando carrito…</p>;
  }
  if (items.length === 0) {
    return <p className="py-8 text-center text-neutral-500">El carrito está vacío</p>;
  }
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <ul aria-label="Carrito" className="divide-y divide-neutral-100">
        {items.map((line) => (
          <li key={line.menuItemId} className="flex items-center gap-3 py-3">
            <span className="flex-1 font-medium text-neutral-900">{line.name}</span>
            <span className="text-sm text-neutral-500">×{line.quantity}</span>
            <span className="w-28 text-right font-medium">{formatMoney(line.subtotal)}</span>
            {onRemove !== undefined && (
              <button
                type="button"
                onClick={() => onRemove(line.menuItemId)}
                className="rounded-md px-2 py-1 text-sm text-red-600 transition hover:bg-red-50"
              >
                Quitar
              </button>
            )}
          </li>
        ))}
      </ul>

      {total !== null && (
        <p className="mt-4 border-t border-neutral-100 pt-4 text-right text-lg font-bold text-neutral-900">
          Total: {formatMoney(total)}
        </p>
      )}

      {onCheckout !== undefined && (
        <button
          type="button"
          onClick={onCheckout}
          className="mt-4 w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
        >
          Confirmar pedido
        </button>
      )}
    </div>
  );
}
