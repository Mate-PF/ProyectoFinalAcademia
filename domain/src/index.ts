// Barrel del dominio: punto único de importación para el backend/tests.

// Value Objects
export { Money } from "./value-objects/Money";
export { Email } from "./value-objects/Email";
export { Address, type AddressProps } from "./value-objects/Address";

// Entities
export { User, type UserRole, type UserProps } from "./entities/User";
export { Restaurant, type RestaurantProps } from "./entities/Restaurant";
export { MenuItem, type MenuItemProps } from "./entities/MenuItem";
export { Cart, type CartProps } from "./entities/Cart";
export { CartItem } from "./entities/CartItem";
export { Order, type OrderStatus, type OrderProps } from "./entities/Order";
export { OrderItem, type OrderItemProps } from "./entities/OrderItem";

// Ports (services) — el dominio define las interfaces; la infraestructura las implementa.
export type { PasswordHasher } from "./services/PasswordHasher";
export type { IdGenerator } from "./services/IdGenerator";
export type { UserRepository } from "./services/UserRepository";

// Use cases
export { RegisterUser, type RegisterUserInput } from "./use-cases/RegisterUser";
