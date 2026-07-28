import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cart } from "../components/Cart";
import { useCart } from "../cart/CartContext";

export function CartPage() {
  const { items, total, remove, checkout, loading } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  async function handleCheckout() {
    setError(undefined);
    try {
      const orderId = await checkout();
      navigate(`/orders/${orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al confirmar");
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Tu carrito</h2>
      {error !== undefined && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <Cart
        items={items}
        total={total}
        loading={loading}
        onRemove={(mid) => void remove(mid)}
        onCheckout={() => void handleCheckout()}
      />
    </div>
  );
}
