import type { Order } from "../entities/Order";
import type { UserRole } from "../entities/User";
import type { OrderRepository } from "../services/OrderRepository";
import type { UserRepository } from "../services/UserRepository";

export interface AssignDelivererInput {
  orderId: string;
  actorRole: UserRole;
  delivererId: string;
}

/**
 * Caso de uso: asignar un repartidor a un pedido.
 * Solo el restaurante (ADMIN) puede asignar, y el asignado debe ser un usuario
 * con rol REPARTIDOR. La entidad Order valida que el estado lo permita.
 */
export class AssignDeliverer {
  constructor(
    private readonly orders: OrderRepository,
    private readonly users: UserRepository,
  ) {}

  async execute(input: AssignDelivererInput): Promise<Order> {
    if (input.actorRole !== "ADMIN") {
      throw new Error("Solo el restaurante (ADMIN) puede asignar repartidor");
    }

    const order = await this.orders.findById(input.orderId);
    if (order === null) {
      throw new Error("El pedido no existe");
    }

    const deliverer = await this.users.findById(input.delivererId);
    if (deliverer === null || !deliverer.isRepartidor()) {
      throw new Error("El repartidor no existe o no tiene rol REPARTIDOR");
    }

    order.assignDeliverer(input.delivererId);
    await this.orders.save(order);
    return order;
  }
}
