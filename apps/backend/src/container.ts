import {
  RegisterUser,
  LoginUser,
  CreateRestaurant,
  AddMenuItem,
  ListMenu,
  AddToCart,
  RemoveFromCart,
  ViewCart,
  Checkout,
  ChangeOrderStatus,
  AssignDeliverer,
  TrackOrder,
} from "@proyecto/domain";
import { BcryptPasswordHasher } from "./adapters/BcryptPasswordHasher";
import { JwtTokenGenerator } from "./adapters/JwtTokenGenerator";
import { CryptoIdGenerator } from "./adapters/CryptoIdGenerator";
import {
  InMemoryUserRepository,
  InMemoryRestaurantRepository,
  InMemoryMenuItemRepository,
  InMemoryCartRepository,
  InMemoryOrderRepository,
} from "./adapters/in-memory/repositories";

export interface Container {
  tokens: JwtTokenGenerator;
  useCases: {
    registerUser: RegisterUser;
    loginUser: LoginUser;
    createRestaurant: CreateRestaurant;
    addMenuItem: AddMenuItem;
    listMenu: ListMenu;
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
 * Composition root: acá (y SOLO acá) se eligen las implementaciones concretas
 * de cada puerto y se arman los casos de uso. El resto del backend (rutas) usa
 * los casos de uso sin saber qué adaptador hay detrás.
 */
export function buildContainer(config: { jwtSecret: string }): Container {
  // Adaptadores de persistencia (en memoria por ahora).
  const users = new InMemoryUserRepository();
  const restaurants = new InMemoryRestaurantRepository();
  const menuItems = new InMemoryMenuItemRepository();
  const carts = new InMemoryCartRepository();
  const orders = new InMemoryOrderRepository();

  // Adaptadores de servicios.
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
