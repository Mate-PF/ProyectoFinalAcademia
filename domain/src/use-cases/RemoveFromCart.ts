import type { Cart } from "../entities/Cart";
import type { CartRepository } from "../services/CartRepository";

export interface RemoveFromCartInput {
  customerId: string;
  menuItemId: string;
}

/** Caso de uso: quitar un ítem del carrito del cliente. */
export class RemoveFromCart {
  constructor(private readonly carts: CartRepository) {}

  async execute(input: RemoveFromCartInput): Promise<Cart> {
    const cart = await this.carts.findByCustomer(input.customerId);
    if (cart === null) {
      throw new Error("No hay un carrito para este cliente");
    }
    cart.removeItem(input.menuItemId);
    await this.carts.save(cart);
    return cart;
  }
}
