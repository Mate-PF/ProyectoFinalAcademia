import type { Order } from "../entities/Order";
import type { OrderRepository } from "../services/OrderRepository";
import type { RestaurantRepository } from "../services/RestaurantRepository";

export interface ListRestaurantOrdersInput {
  restaurantId: string;
  actorId: string;
}

/** Caso de uso: pedidos de un restaurante (solo su dueño ADMIN puede verlos). */
export class ListRestaurantOrders {
  constructor(
    private readonly restaurants: RestaurantRepository,
    private readonly orders: OrderRepository,
  ) {}

  async execute(input: ListRestaurantOrdersInput): Promise<Order[]> {
    const restaurant = await this.restaurants.findById(input.restaurantId);
    if (restaurant === null) {
      throw new Error("El restaurante no existe");
    }
    if (!restaurant.isOwnedBy(input.actorId)) {
      throw new Error("Solo el dueño puede ver los pedidos del restaurante");
    }
    return this.orders.findByRestaurant(input.restaurantId);
  }
}
