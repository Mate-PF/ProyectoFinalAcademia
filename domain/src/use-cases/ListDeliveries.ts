import type { Order } from "../entities/Order";
import type { OrderRepository } from "../services/OrderRepository";

export interface ListDeliveriesInput {
  delivererId: string;
}

/** Caso de uso: entregas asignadas a un repartidor. */
export class ListDeliveries {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: ListDeliveriesInput): Promise<Order[]> {
    return this.orders.findByDeliverer(input.delivererId);
  }
}
