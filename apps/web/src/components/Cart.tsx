import type { CartLine, Money } from "../api/client";
import { formatMoney } from "../format";

export interface CartProps {
  items: CartLine[];
  total: Money | null;
  onRemove?: (menuItemId: string) => void;
  onCheckout?: () => void;
  loading?: boolean;
}

/** Carrito de compra (presentación). La red vive afuera (via callbacks). */
export function Cart({ items, total, onRemove, onCheckout, loading = false }: CartProps) {
  if (loading) {
    return <p>Cargando carrito…</p>;
  }
  if (items.length === 0) {
    return <p>El carrito está vacío</p>;
  }
  return (
    <div>
      <ul aria-label="Carrito">
        {items.map((line) => (
          <li key={line.menuItemId}>
            <span>{line.name}</span>
            <span>×{line.quantity}</span>
            <span>{formatMoney(line.subtotal)}</span>
            {onRemove !== undefined && (
              <button type="button" onClick={() => onRemove(line.menuItemId)}>
                Quitar
              </button>
            )}
          </li>
        ))}
      </ul>
      {total !== null && <p>Total: {formatMoney(total)}</p>}
      {onCheckout !== undefined && (
        <button type="button" onClick={onCheckout}>
          Confirmar pedido
        </button>
      )}
    </div>
  );
}
