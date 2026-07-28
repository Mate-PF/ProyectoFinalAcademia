import { Money } from "../value-objects/Money";
import { MenuItem } from "./MenuItem";
import { CartItem } from "./CartItem";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";

export interface CartProps {
  id: string;
  customerId: string;
  /**
   * Un carrito es de UN restaurante: no se mezclan ítems de locales distintos.
   * En el checkout, ese `restaurantId` pasa directo al pedido.
   */
  restaurantId: string;
}

/**
 * Carrito de un cliente (entidad con ciclo de vida: se agregan y quitan líneas).
 * El `checkout` lo transforma en un `Order`, tomando un snapshot de los precios
 * actuales de cada `MenuItem`.
 */
export class Cart {
  private _items: CartItem[] = [];

  readonly id: string;
  readonly customerId: string;
  readonly restaurantId: string;

  private constructor(props: CartProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.restaurantId = props.restaurantId;
  }

  /**
   * Reconstruye un carrito desde su estado persistido, con sus líneas ya
   * cargadas (cada CartItem referencia su MenuItem recuperado por el repositorio).
   */
  static rehydrate(props: CartProps, items: CartItem[]): Cart {
    const cart = new Cart(props);
    cart._items = [...items];
    return cart;
  }

  static create(props: CartProps): Cart {
    if (props.id.trim().length === 0) {
      throw new Error("El carrito requiere un id");
    }
    if (props.customerId.trim().length === 0) {
      throw new Error("El carrito requiere un cliente");
    }
    if (props.restaurantId.trim().length === 0) {
      throw new Error("El carrito requiere un restaurante");
    }
    return new Cart(props);
  }

  get items(): readonly CartItem[] {
    return this._items;
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  /** Agrega un ítem. Si ya estaba, acumula la cantidad en la misma línea. */
  addItem(menuItem: MenuItem, quantity = 1): void {
    if (menuItem.restaurantId !== this.restaurantId) {
      throw new Error("El ítem pertenece a otro restaurante");
    }
    if (!menuItem.available) {
      throw new Error("El ítem no está disponible");
    }
    const existing = this._items.find((item) => item.menuItemId === menuItem.id);
    if (existing) {
      this._items = this._items.map((item) =>
        item.menuItemId === menuItem.id ? item.withQuantity(item.quantity + quantity) : item,
      );
    } else {
      this._items = [...this._items, CartItem.create(menuItem, quantity)];
    }
  }

  removeItem(menuItemId: string): void {
    this._items = this._items.filter((item) => item.menuItemId !== menuItemId);
  }

  clear(): void {
    this._items = [];
  }

  total(): Money {
    const [first, ...rest] = this._items;
    if (first === undefined) {
      throw new Error("El carrito está vacío");
    }
    return rest.reduce((acc, item) => acc.add(item.subtotal()), first.subtotal());
  }

  /** Convierte el carrito en un pedido (PENDIENTE), snapshotando precios actuales. */
  checkout(orderId: string): Order {
    if (this.isEmpty()) {
      throw new Error("No se puede confirmar un carrito vacío");
    }
    const orderItems = this._items.map((item) =>
      OrderItem.create({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        unitPrice: item.menuItem.price, // snapshot del precio al momento del checkout
        quantity: item.quantity,
      }),
    );
    return Order.create({
      id: orderId,
      customerId: this.customerId,
      restaurantId: this.restaurantId,
      items: orderItems,
    });
  }
}
