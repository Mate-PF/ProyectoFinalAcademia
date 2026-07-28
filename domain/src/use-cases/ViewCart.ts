import type { CartItem } from "../entities/CartItem";
import type { Money } from "../value-objects/Money";
import type { CartRepository } from "../services/CartRepository";

/** Vista de lectura del carrito, con el total ya calculado (null si está vacío). */
export interface CartView {
  cartId: string;
  restaurantId: string;
  items: readonly CartItem[];
  total: Money | null;
}

/** Caso de uso: ver el carrito del cliente con su total. Devuelve null si no tiene. */
export class ViewCart {
  constructor(private readonly carts: CartRepository) {}

  async execute(customerId: string): Promise<CartView | null> {
    const cart = await this.carts.findByCustomer(customerId);
    if (cart === null) {
      return null;
    }
    return {
      cartId: cart.id,
      restaurantId: cart.restaurantId,
      items: cart.items,
      total: cart.isEmpty() ? null : cart.total(),
    };
  }
}
