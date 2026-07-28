import type { User, UserRole } from "../entities/User";
import type { UserRepository } from "../services/UserRepository";

export interface ListDeliverersInput {
  actorRole: UserRole;
}

/** Caso de uso: listar repartidores (para que el ADMIN asigne uno a un pedido). */
export class ListDeliverers {
  constructor(private readonly users: UserRepository) {}

  async execute(input: ListDeliverersInput): Promise<User[]> {
    if (input.actorRole !== "ADMIN") {
      throw new Error("Solo el restaurante (ADMIN) puede listar repartidores");
    }
    return this.users.findByRole("REPARTIDOR");
  }
}
