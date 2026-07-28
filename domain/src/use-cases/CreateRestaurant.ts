import { Restaurant } from "../entities/Restaurant";
import { Address, type AddressProps } from "../value-objects/Address";
import type { UserRepository } from "../services/UserRepository";
import type { RestaurantRepository } from "../services/RestaurantRepository";
import type { IdGenerator } from "../services/IdGenerator";

export interface CreateRestaurantInput {
  ownerId: string;
  name: string;
  address: AddressProps;
}

/**
 * Caso de uso: crear un restaurante. Regla de negocio: solo un usuario con
 * rol ADMIN puede hacerlo (permiso por rol). Queda como su dueño.
 */
export class CreateRestaurant {
  constructor(
    private readonly users: UserRepository,
    private readonly restaurants: RestaurantRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreateRestaurantInput): Promise<Restaurant> {
    const owner = await this.users.findById(input.ownerId);
    if (owner === null) {
      throw new Error("El dueño no existe");
    }
    if (!owner.isAdmin()) {
      throw new Error("Solo un ADMIN puede crear un restaurante");
    }

    const restaurant = Restaurant.create({
      id: this.ids.next(),
      name: input.name,
      ownerId: input.ownerId,
      address: Address.create(input.address),
    });

    await this.restaurants.save(restaurant);
    return restaurant;
  }
}
