import { Money } from "../value-objects/Money";

export interface OrderItemProps {
  menuItemId: string;
  /** Snapshot del nombre al momento del pedido (no cambia si luego editan el menú). */
  name: string;
  /** Snapshot del precio unitario al momento del pedido. */
  unitPrice: Money;
  quantity: number;
}

/**
 * Línea de un pedido. Guarda un "snapshot" del ítem (nombre + precio unitario)
 * al momento de la compra: aunque después cambie el menú, el pedido histórico
 * conserva lo que el cliente efectivamente pagó.
 */
export class OrderItem {
  private constructor(
    public readonly menuItemId: string,
    public readonly name: string,
    public readonly unitPrice: Money,
    public readonly quantity: number,
  ) {}

  static create(props: OrderItemProps): OrderItem {
    if (!Number.isInteger(props.quantity) || props.quantity < 1) {
      throw new Error(`La cantidad debe ser un entero >= 1: ${props.quantity}`);
    }
    const name = props.name.trim();
    if (name.length === 0) {
      throw new Error("El ítem del pedido requiere un nombre");
    }
    return new OrderItem(props.menuItemId, name, props.unitPrice, props.quantity);
  }

  /** Precio de la línea = precio unitario × cantidad. */
  subtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}
