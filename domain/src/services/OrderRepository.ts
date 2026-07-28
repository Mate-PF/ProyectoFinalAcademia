import type { Order } from "../entities/Order";

/** Puerto de persistencia de pedidos. */
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByCustomer(customerId: string): Promise<Order[]>;
  findByRestaurant(restaurantId: string): Promise<Order[]>;
  findByDeliverer(delivererId: string): Promise<Order[]>;
}
