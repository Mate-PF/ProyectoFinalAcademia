import type { Restaurant } from "../entities/Restaurant";
import type { RestaurantRepository } from "../services/RestaurantRepository";

/** Caso de uso: listar todos los restaurantes (para que el cliente elija). */
export class ListRestaurants {
  constructor(private readonly restaurants: RestaurantRepository) {}

  async execute(): Promise<Restaurant[]> {
    return this.restaurants.findAll();
  }
}
