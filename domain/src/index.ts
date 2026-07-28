// Barrel del dominio: punto único de importación para el backend/tests.

// Value Objects
export { Money } from "./value-objects/Money";
export { Email } from "./value-objects/Email";
export { Address, type AddressProps } from "./value-objects/Address";

// Entities
export { Order, type OrderStatus, type OrderProps } from "./entities/Order";
export { OrderItem, type OrderItemProps } from "./entities/OrderItem";
