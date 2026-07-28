import { Money } from "../value-objects/Money";

export interface MenuItemProps {
  id: string;
  restaurantId: string;
  name: string;
  price: Money;
  /** Por defecto el ítem se crea disponible. */
  available?: boolean;
}

/**
 * Ítem del menú de un restaurante (entidad con identidad `id`).
 * Tiene ciclo de vida: el precio y la disponibilidad cambian con el tiempo,
 * siempre a través de métodos que preservan el invariante (precio positivo).
 */
export class MenuItem {
  private _price: Money;
  private _available: boolean;

  readonly id: string;
  readonly restaurantId: string;
  readonly name: string;

  private constructor(props: Required<MenuItemProps>) {
    this.id = props.id;
    this.restaurantId = props.restaurantId;
    this.name = props.name;
    this._price = props.price;
    this._available = props.available;
  }

  static create(props: MenuItemProps): MenuItem {
    const name = props.name.trim();
    if (name.length === 0) {
      throw new Error("El ítem de menú requiere un nombre");
    }
    if (!props.price.isPositive()) {
      throw new Error("El precio del ítem debe ser positivo");
    }
    return new MenuItem({ ...props, name, available: props.available ?? true });
  }

  get price(): Money {
    return this._price;
  }

  get available(): boolean {
    return this._available;
  }

  changePrice(newPrice: Money): void {
    if (!newPrice.isPositive()) {
      throw new Error("El precio del ítem debe ser positivo");
    }
    this._price = newPrice;
  }

  markAvailable(): void {
    this._available = true;
  }

  markUnavailable(): void {
    this._available = false;
  }
}
