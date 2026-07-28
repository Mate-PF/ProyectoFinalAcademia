import type { User, UserRole } from "../../entities/User";
import type { Restaurant } from "../../entities/Restaurant";
import type { MenuItem } from "../../entities/MenuItem";
import type { Cart } from "../../entities/Cart";
import type { Order } from "../../entities/Order";
import type { Email } from "../../value-objects/Email";
import type { UserRepository } from "../../services/UserRepository";
import type { RestaurantRepository } from "../../services/RestaurantRepository";
import type { MenuItemRepository } from "../../services/MenuItemRepository";
import type { CartRepository } from "../../services/CartRepository";
import type { OrderRepository } from "../../services/OrderRepository";
import type { PasswordHasher } from "../../services/PasswordHasher";
import type { IdGenerator } from "../../services/IdGenerator";
import type { AuthTokenPayload, TokenGenerator } from "../../services/TokenGenerator";

/** Repositorio de usuarios en memoria (fake) para los tests de casos de uso. */
export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.byId.set(user.id, user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.byId.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.byId.get(id) ?? null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return [...this.byId.values()].filter((user) => user.role === role);
  }
}

/** Repositorio de restaurantes en memoria (fake). */
export class InMemoryRestaurantRepository implements RestaurantRepository {
  private readonly byId = new Map<string, Restaurant>();

  async save(restaurant: Restaurant): Promise<void> {
    this.byId.set(restaurant.id, restaurant);
  }

  async findById(id: string): Promise<Restaurant | null> {
    return this.byId.get(id) ?? null;
  }

  async findAll(): Promise<Restaurant[]> {
    return [...this.byId.values()];
  }
}

/** Repositorio de ítems de menú en memoria (fake). */
export class InMemoryMenuItemRepository implements MenuItemRepository {
  private readonly byId = new Map<string, MenuItem>();

  async save(item: MenuItem): Promise<void> {
    this.byId.set(item.id, item);
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.byId.get(id) ?? null;
  }

  async findByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return [...this.byId.values()].filter((item) => item.restaurantId === restaurantId);
  }
}

/** Repositorio de carritos en memoria (fake): un carrito por cliente. */
export class InMemoryCartRepository implements CartRepository {
  private readonly byCustomer = new Map<string, Cart>();

  async save(cart: Cart): Promise<void> {
    this.byCustomer.set(cart.customerId, cart);
  }

  async findByCustomer(customerId: string): Promise<Cart | null> {
    return this.byCustomer.get(customerId) ?? null;
  }
}

/** Repositorio de pedidos en memoria (fake). */
export class InMemoryOrderRepository implements OrderRepository {
  private readonly byId = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.byId.set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.byId.get(id) ?? null;
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return [...this.byId.values()].filter((order) => order.customerId === customerId);
  }

  async findByRestaurant(restaurantId: string): Promise<Order[]> {
    return [...this.byId.values()].filter((order) => order.restaurantId === restaurantId);
  }

  async findByDeliverer(delivererId: string): Promise<Order[]> {
    return [...this.byId.values()].filter((order) => order.delivererId === delivererId);
  }
}

/** Hasher determinístico (fake): "hashed:<plain>". Suficiente para testear la lógica. */
export class FakePasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plain}`;
  }
}

/** Generador de ids fijo (fake) para tests determinísticos. */
export class FixedIdGenerator implements IdGenerator {
  constructor(private readonly id: string = "generated-id") {}

  next(): string {
    return this.id;
  }
}

/** Emisor de tokens fake: codifica el payload en un string legible. */
export class FakeTokenGenerator implements TokenGenerator {
  async generate(payload: AuthTokenPayload): Promise<string> {
    return `token:${payload.userId}:${payload.role}`;
  }
}
