import {
  RegisterUser,
  LoginUser,
  CreateRestaurant,
  AddMenuItem,
  ListMenu,
  ListRestaurants,
  ListMyOrders,
  ListRestaurantOrders,
  ListDeliveries,
  AddToCart,
  RemoveFromCart,
  ViewCart,
  Checkout,
  ChangeOrderStatus,
  AssignDeliverer,
  TrackOrder,
} from "@proyecto/domain";
import type {
  UserRepository,
  RestaurantRepository,
  MenuItemRepository,
  CartRepository,
  OrderRepository,
} from "@proyecto/domain";
import { BcryptPasswordHasher } from "./adapters/BcryptPasswordHasher";
import { JwtTokenGenerator } from "./adapters/JwtTokenGenerator";
import { CryptoIdGenerator } from "./adapters/CryptoIdGenerator";

/** Los 5 repositorios (puertos) que el backend necesita, inyectados desde afuera. */
export interface Repositories {
  users: UserRepository;
  restaurants: RestaurantRepository;
  menuItems: MenuItemRepository;
  carts: CartRepository;
  orders: OrderRepository;
}

export interface ContainerConfig extends Repositories {
  jwtSecret: string;
}

export interface Container {
  tokens: JwtTokenGenerator;
  useCases: {
    registerUser: RegisterUser;
    loginUser: LoginUser;
    createRestaurant: CreateRestaurant;
    addMenuItem: AddMenuItem;
    listMenu: ListMenu;
    listRestaurants: ListRestaurants;
    listMyOrders: ListMyOrders;
    listRestaurantOrders: ListRestaurantOrders;
    listDeliveries: ListDeliveries;
    addToCart: AddToCart;
    removeFromCart: RemoveFromCart;
    viewCart: ViewCart;
    checkout: Checkout;
    changeOrderStatus: ChangeOrderStatus;
    assignDeliverer: AssignDeliverer;
    trackOrder: TrackOrder;
  };
}

/**
 * Composition root. Recibe los repositorios YA construidos (en memoria o Prisma)
 * y arma los servicios + casos de uso. El swap de persistencia se hace afuera
 * (en main.ts): mismos casos de uso, distinto adaptador de repositorio.
 */
export function buildContainer(config: ContainerConfig): Container {
  const { users, restaurants, menuItems, carts, orders } = config;

  const hasher = new BcryptPasswordHasher();
  const tokens = new JwtTokenGenerator(config.jwtSecret);
  const ids = new CryptoIdGenerator();

  return {
    tokens,
    useCases: {
      registerUser: new RegisterUser(users, hasher, ids),
      loginUser: new LoginUser(users, hasher, tokens),
      createRestaurant: new CreateRestaurant(users, restaurants, ids),
      addMenuItem: new AddMenuItem(restaurants, menuItems, ids),
      listMenu: new ListMenu(restaurants, menuItems),
      listRestaurants: new ListRestaurants(restaurants),
      listMyOrders: new ListMyOrders(orders),
      listRestaurantOrders: new ListRestaurantOrders(restaurants, orders),
      listDeliveries: new ListDeliveries(orders),
      addToCart: new AddToCart(carts, menuItems, ids),
      removeFromCart: new RemoveFromCart(carts),
      viewCart: new ViewCart(carts),
      checkout: new Checkout(carts, orders, ids),
      changeOrderStatus: new ChangeOrderStatus(orders),
      assignDeliverer: new AssignDeliverer(orders, users),
      trackOrder: new TrackOrder(orders),
    },
  };
}
