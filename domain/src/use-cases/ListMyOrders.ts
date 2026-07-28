import type { Order } from "../entities/Order";
import type { OrderRepository } from "../services/OrderRepository";

export interface ListMyOrdersInput {
  customerId: string;
}

/** Caso de uso: historial de pedidos del cliente. */
export class ListMyOrders {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: ListMyOrdersInput): Promise<Order[]> {
    return this.orders.findByCustomer(input.customerId);
  }
}
