import type { Order } from "../entities/Order";
import type { UserRole } from "../entities/User";
import type { OrderRepository } from "../services/OrderRepository";

export type OrderAction = "CONFIRM" | "START_PREPARING" | "DISPATCH" | "DELIVER" | "CANCEL";

export interface ChangeOrderStatusInput {
  orderId: string;
  actorId: string;
  actorRole: UserRole;
  action: OrderAction;
}

/**
 * Caso de uso: avanzar/cancelar un pedido disparando la máquina de estados.
 * Aplica permisos por rol; la legalidad de la transición la valida la entidad Order.
 */
export class ChangeOrderStatus {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: ChangeOrderStatusInput): Promise<Order> {
    const order = await this.orders.findById(input.orderId);
    if (order === null) {
      throw new Error("El pedido no existe");
    }

    this.assertAuthorized(input, order);

    const apply: Record<OrderAction, () => void> = {
      CONFIRM: () => order.confirm(),
      START_PREPARING: () => order.startPreparing(),
      DISPATCH: () => order.dispatch(),
      DELIVER: () => order.deliver(),
      CANCEL: () => order.cancel(),
    };
    apply[input.action]();

    await this.orders.save(order);
    return order;
  }

  private assertAuthorized(input: ChangeOrderStatusInput, order: Order): void {
    const { action, actorRole, actorId } = input;
    const forbidden = new Error("No tenés permiso para esta acción sobre el pedido");

    if (action === "CONFIRM" || action === "START_PREPARING" || action === "DISPATCH") {
      if (actorRole !== "ADMIN") throw forbidden;
      return;
    }
    if (action === "DELIVER") {
      if (actorRole !== "REPARTIDOR" || order.delivererId !== actorId) throw forbidden;
      return;
    }
    // CANCEL: el restaurante (ADMIN) o el cliente dueño del pedido.
    if (actorRole !== "ADMIN" && order.customerId !== actorId) throw forbidden;
  }
}
