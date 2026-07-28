import type { Restaurant } from "../entities/Restaurant";

/** Puerto de persistencia de restaurantes. */
export interface RestaurantRepository {
  save(restaurant: Restaurant): Promise<void>;
  findById(id: string): Promise<Restaurant | null>;
  findAll(): Promise<Restaurant[]>;
}
