import type {
  User,
  Restaurant,
  MenuItem,
  Cart,
  Order,
  Email,
  UserRepository,
  RestaurantRepository,
  MenuItemRepository,
  CartRepository,
  OrderRepository,
} from "@proyecto/domain";

/**
 * Persistencia en memoria (adaptadores de los puertos de repositorio).
 * Sirve para correr y probar el backend sin base de datos; en la entrega de
 * Docker se reemplazan por adaptadores contra Postgres (p. ej. Prisma), sin
 * tocar el dominio ni los casos de uso.
 */

export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.byId.set(user.id, user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.byId.values()) {
      if (user.email.equals(email)) return user;
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.byId.get(id) ?? null;
  }
}

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

export class InMemoryCartRepository implements CartRepository {
  private readonly byCustomer = new Map<string, Cart>();

  async save(cart: Cart): Promise<void> {
    this.byCustomer.set(cart.customerId, cart);
  }

  async findByCustomer(customerId: string): Promise<Cart | null> {
    return this.byCustomer.get(customerId) ?? null;
  }
}

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
}
