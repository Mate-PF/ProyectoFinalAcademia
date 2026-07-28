import type { Order } from "../entities/Order";
import type { CartRepository } from "../services/CartRepository";
import type { OrderRepository } from "../services/OrderRepository";
import type { IdGenerator } from "../services/IdGenerator";

export interface CheckoutInput {
  customerId: string;
}

/**
 * Caso de uso: confirmar el carrito y crear el pedido.
 * Convierte el carrito en un Order (snapshot de precios), lo persiste y vacía
 * el carrito para dejarlo listo para una próxima compra.
 */
export class Checkout {
  constructor(
    private readonly carts: CartRepository,
    private readonly orders: OrderRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CheckoutInput): Promise<Order> {
    const cart = await this.carts.findByCustomer(input.customerId);
    if (cart === null || cart.isEmpty()) {
      throw new Error("No hay un carrito con ítems para confirmar");
    }

    const order = cart.checkout(this.ids.next());
    await this.orders.save(order);

    cart.clear();
    await this.carts.save(cart);

    return order;
  }
}
