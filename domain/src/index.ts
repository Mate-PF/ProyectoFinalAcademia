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
