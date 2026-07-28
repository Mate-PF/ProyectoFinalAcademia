import { Address } from "../value-objects/Address";

export interface RestaurantProps {
  id: string;
  name: string;
  /** Id del usuario ADMIN dueño del restaurante. */
  ownerId: string;
  address: Address;
}

/**
 * Restaurante (entidad con identidad `id`). Ofrece ítems de menú y recibe pedidos.
 */
export class Restaurant {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly address: Address;

  private constructor(props: RestaurantProps) {
    this.id = props.id;
    this.name = props.name;
    this.ownerId = props.ownerId;
    this.address = props.address;
  }

  static create(props: RestaurantProps): Restaurant {
    const name = props.name.trim();
    if (name.length === 0) {
      throw new Error("El restaurante requiere un nombre");
    }
    if (props.ownerId.trim().length === 0) {
      throw new Error("El restaurante requiere un dueño (ownerId)");
    }
    return new Restaurant({ ...props, name });
  }

  isOwnedBy(userId: string): boolean {
    return this.ownerId === userId;
  }
}
