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
export { Order, type OrderStatus, type OrderProps, type OrderSnapshot } from "./entities/Order";
export { OrderItem, type OrderItemProps } from "./entities/OrderItem";

// Ports (services) — el dominio define las interfaces; la infraestructura las implementa.
export type { PasswordHasher } from "./services/PasswordHasher";
export type { IdGenerator } from "./services/IdGenerator";
export type { TokenGenerator, AuthTokenPayload } from "./services/TokenGenerator";
export type { UserRepository } from "./services/UserRepository";
export type { RestaurantRepository } from "./services/RestaurantRepository";
export type { MenuItemRepository } from "./services/MenuItemRepository";
export type { CartRepository } from "./services/CartRepository";
export type { OrderRepository } from "./services/OrderRepository";

// Use cases
export { RegisterUser, type RegisterUserInput } from "./use-cases/RegisterUser";
export { LoginUser, type LoginUserInput, type LoginUserResult } from "./use-cases/LoginUser";
export { CreateRestaurant, type CreateRestaurantInput } from "./use-cases/CreateRestaurant";
export { AddMenuItem, type AddMenuItemInput } from "./use-cases/AddMenuItem";
export { ListMenu, type ListMenuInput } from "./use-cases/ListMenu";
export { ListRestaurants } from "./use-cases/ListRestaurants";
export { ListMyOrders, type ListMyOrdersInput } from "./use-cases/ListMyOrders";
export { ListRestaurantOrders, type ListRestaurantOrdersInput } from "./use-cases/ListRestaurantOrders";
export { ListDeliveries, type ListDeliveriesInput } from "./use-cases/ListDeliveries";
export { AddToCart, type AddToCartInput } from "./use-cases/AddToCart";
export { RemoveFromCart, type RemoveFromCartInput } from "./use-cases/RemoveFromCart";
export { ViewCart, type CartView } from "./use-cases/ViewCart";
export { Checkout, type CheckoutInput } from "./use-cases/Checkout";
export { ChangeOrderStatus, type ChangeOrderStatusInput, type OrderAction } from "./use-cases/ChangeOrderStatus";
export { AssignDeliverer, type AssignDelivererInput } from "./use-cases/AssignDeliverer";
export { TrackOrder, type TrackOrderInput, type OrderTracking } from "./use-cases/TrackOrder";
