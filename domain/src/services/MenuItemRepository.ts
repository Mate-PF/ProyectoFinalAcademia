import type { MenuItem } from "../entities/MenuItem";

/** Puerto de persistencia de ítems de menú. */
export interface MenuItemRepository {
  save(item: MenuItem): Promise<void>;
  findById(id: string): Promise<MenuItem | null>;
  findByRestaurant(restaurantId: string): Promise<MenuItem[]>;
}
