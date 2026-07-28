import type { Money } from "../value-objects/Money";
import type { OrderStatus } from "../entities/Order";
import type { OrderRepository } from "../services/OrderRepository";

export interface TrackOrderInput {
  orderId: string;
  customerId: string;
}

/** Vista de seguimiento del pedido. */
export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  total: Money;
  delivererId: string | null;
}

/**
 * Caso de uso: seguir el estado de un pedido. Solo el cliente dueño puede verlo.
 */
export class TrackOrder {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: TrackOrderInput): Promise<OrderTracking> {
    const order = await this.orders.findById(input.orderId);
    if (order === null) {
      throw new Error("El pedido no existe");
    }
    if (order.customerId !== input.customerId) {
      throw new Error("No podés seguir un pedido que no es tuyo");
    }
    return {
      orderId: order.id,
      status: order.status,
      total: order.total(),
      delivererId: order.delivererId,
    };
  }
}
