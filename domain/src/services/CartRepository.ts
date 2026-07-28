import type { Cart } from "../entities/Cart";

/** Puerto de persistencia del carrito. Un cliente tiene a lo sumo un carrito activo. */
export interface CartRepository {
  save(cart: Cart): Promise<void>;
  findByCustomer(customerId: string): Promise<Cart | null>;
}
