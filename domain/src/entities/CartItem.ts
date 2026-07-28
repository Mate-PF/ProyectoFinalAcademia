import { Money } from "../value-objects/Money";
import { MenuItem } from "./MenuItem";

/**
 * Línea del carrito. A diferencia de `OrderItem` (que guarda un snapshot), la
 * línea del carrito referencia el `MenuItem` VIVO: si cambia el precio del menú,
 * el carrito refleja el precio actual. El snapshot recién se toma en el checkout.
 */
export class CartItem {
  private constructor(
    public readonly menuItem: MenuItem,
    public readonly quantity: number,
  ) {}

  static create(menuItem: MenuItem, quantity: number): CartItem {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`La cantidad debe ser un entero >= 1: ${quantity}`);
    }
    return new CartItem(menuItem, quantity);
  }

  get menuItemId(): string {
    return this.menuItem.id;
  }

  subtotal(): Money {
    return this.menuItem.price.multiply(this.quantity);
  }

  /** Devuelve una nueva línea con otra cantidad (inmutable). */
  withQuantity(quantity: number): CartItem {
    return CartItem.create(this.menuItem, quantity);
  }
}
