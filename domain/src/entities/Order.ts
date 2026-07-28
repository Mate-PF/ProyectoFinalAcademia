import { Money } from "../value-objects/Money";
import { OrderItem } from "./OrderItem";

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

/**
 * Tabla de transiciones válidas de la máquina de estados del pedido.
 * Codifica las reglas del dominio en un solo lugar:
 * - Camino feliz hacia adelante: PENDIENTE → CONFIRMADO → EN_PREPARACION → EN_CAMINO → ENTREGADO.
 * - CANCELADO solo desde los primeros estados (antes de salir a reparto).
 * - Sin saltos ni retrocesos; ENTREGADO y CANCELADO son terminales (sin salida).
 */
const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDIENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["EN_PREPARACION", "CANCELADO"],
  EN_PREPARACION: ["EN_CAMINO", "CANCELADO"],
  EN_CAMINO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

export interface OrderProps {
  id: string;
  customerId: string;
  restaurantId: string;
  items: OrderItem[];
}

/** Estado persistido de un pedido, para reconstruirlo desde un repositorio. */
export interface OrderSnapshot extends OrderProps {
  status: OrderStatus;
  delivererId: string | null;
}

/**
 * Pedido (entidad con identidad: `id`).
 *
 * A diferencia de un Value Object, una entidad tiene CICLO DE VIDA: su estado
 * cambia con el tiempo. Pero solo a través de métodos que validan cada
 * transición contra la máquina de estados, de modo que el pedido nunca queda
 * en un estado inválido ni "salta" pasos.
 */
export class Order {
  private _status: OrderStatus = "PENDIENTE";
  private _delivererId: string | null = null;

  readonly id: string;
  readonly customerId: string;
  readonly restaurantId: string;
  readonly items: readonly OrderItem[];

  private constructor(props: OrderProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.restaurantId = props.restaurantId;
    this.items = [...props.items]; // copia defensiva: nadie muta las líneas desde afuera
  }

  static create(props: OrderProps): Order {
    if (props.items.length === 0) {
      throw new Error("Un pedido requiere al menos un ítem");
    }
    return new Order(props);
  }

  /**
   * Reconstruye un pedido desde su estado persistido (repositorio), SIN pasar
   * por la máquina de estados: un pedido guardado ya puede estar ENTREGADO o
   * CANCELADO, estados a los que no se llega con `create`. No revalida
   * invariantes: se confía en lo que la base guardó (patrón de reconstitución).
   */
  static rehydrate(snapshot: OrderSnapshot): Order {
    const order = new Order(snapshot);
    order._status = snapshot.status;
    order._delivererId = snapshot.delivererId;
    return order;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get delivererId(): string | null {
    return this._delivererId;
  }

  /** Total del pedido = suma de los subtotales de sus líneas. */
  total(): Money {
    const [first, ...rest] = this.items;
    if (first === undefined) {
      // Inalcanzable por el invariante de `create`, pero lo dejamos explícito.
      throw new Error("El pedido no tiene ítems");
    }
    return rest.reduce((acc, item) => acc.add(item.subtotal()), first.subtotal());
  }

  confirm(): void {
    this.transitionTo("CONFIRMADO");
  }

  startPreparing(): void {
    this.transitionTo("EN_PREPARACION");
  }

  dispatch(): void {
    this.transitionTo("EN_CAMINO");
  }

  deliver(): void {
    this.transitionTo("ENTREGADO");
  }

  cancel(): void {
    this.transitionTo("CANCELADO");
  }

  assignDeliverer(delivererId: string): void {
    if (this._status !== "CONFIRMADO" && this._status !== "EN_PREPARACION") {
      throw new Error(`No se puede asignar repartidor en estado ${this._status}`);
    }
    const id = delivererId.trim();
    if (id.length === 0) {
      throw new Error("El repartidor requiere un id");
    }
    this._delivererId = id;
  }

  private transitionTo(next: OrderStatus): void {
    if (!TRANSITIONS[this._status].includes(next)) {
      throw new Error(`Transición inválida: ${this._status} → ${next}`);
    }
    this._status = next;
  }
}
