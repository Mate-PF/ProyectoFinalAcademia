import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type CartLine, type Money } from "../api/client";
import { useSession } from "../session/SessionContext";

interface CartState {
  items: CartLine[];
  total: Money | null;
  itemCount: number;
  loading: boolean;
  add: (menuItemId: string, quantity?: number) => Promise<void>;
  remove: (menuItemId: string) => Promise<void>;
  checkout: () => Promise<string>;
  refresh: () => Promise<void>;
}

const CartCtx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useSession();
  const [items, setItems] = useState<CartLine[]>([]);
  const [total, setTotal] = useState<Money | null>(null);
  const [loading, setLoading] = useState(false);

  const apply = useCallback((view: { items: CartLine[]; total: Money | null } | null) => {
    setItems(view?.items ?? []);
    setTotal(view?.total ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (token === null) {
      apply(null);
      return;
    }
    setLoading(true);
    try {
      apply(await api.viewCart(token));
    } finally {
      setLoading(false);
    }
  }, [token, apply]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (menuItemId: string, quantity = 1) => {
      if (token === null) return;
      apply(await api.addToCart(token, menuItemId, quantity));
    },
    [token, apply],
  );

  const remove = useCallback(
    async (menuItemId: string) => {
      if (token === null) return;
      apply(await api.removeFromCart(token, menuItemId));
    },
    [token, apply],
  );

  const checkout = useCallback(async (): Promise<string> => {
    if (token === null) throw new Error("Sin sesión");
    const order = await api.checkout(token);
    apply(null);
    return order.id;
  }, [token, apply]);

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, total, itemCount, loading, add, remove, checkout, refresh }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart(): CartState {
  const ctx = useContext(CartCtx);
  if (ctx === null) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return ctx;
}
