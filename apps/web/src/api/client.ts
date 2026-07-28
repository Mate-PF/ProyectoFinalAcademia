const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface Money {
  amount: number;
  currency: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface MenuItemDTO {
  id: string;
  restaurantId: string;
  name: string;
  price: Money;
  available: boolean;
}

export interface RestaurantDTO {
  id: string;
  name: string;
  ownerId: string;
  address: { street: string; number: string; city: string; postalCode: string };
}

export interface CartLine {
  menuItemId: string;
  name: string;
  unitPrice: Money;
  quantity: number;
  subtotal: Money;
}

export interface CartView {
  cartId: string;
  restaurantId: string;
  items: CartLine[];
  total: Money | null;
}

export interface OrderTrackingDTO {
  orderId: string;
  status: string;
  total: Money;
  delivererId: string | null;
}

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export type OrderAction = "CONFIRM" | "START_PREPARING" | "DISPATCH" | "DELIVER" | "CANCEL";

export interface OrderLine {
  menuItemId: string;
  name: string;
  unitPrice: Money;
  quantity: number;
}

export interface OrderDTO {
  id: string;
  customerId: string;
  restaurantId: string;
  status: OrderStatus;
  delivererId: string | null;
  total: Money;
  items: OrderLine[];
}

interface RequestOptions extends RequestInit {
  token?: string;
}

let onUnauthorized: (() => void) | null = null;
/** Registra un handler que se dispara si una request autenticada devuelve 401. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...rest } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token !== undefined ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401 && token !== undefined && onUnauthorized !== null) {
    onUnauthorized(); // token vencido/ inválido en una request autenticada -> cerrar sesión
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Error ${res.status}`);
  }
  return data as T;
}

/** Cliente HTTP tipado contra la API del backend. */
export const api = {
  register(input: Credentials & { name: string; role: string }): Promise<AuthUser> {
    return request("/api/auth/register", { method: "POST", body: JSON.stringify(input) });
  },
  login(input: Credentials): Promise<LoginResponse> {
    return request("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
  },
  listRestaurants(): Promise<RestaurantDTO[]> {
    return request("/api/restaurants");
  },
  listMenu(restaurantId: string): Promise<MenuItemDTO[]> {
    return request(`/api/restaurants/${restaurantId}/menu`);
  },
  createRestaurant(
    token: string,
    input: { name: string; address: { street: string; number: string; city: string; postalCode: string } },
  ): Promise<RestaurantDTO> {
    return request("/api/restaurants", { method: "POST", token, body: JSON.stringify(input) });
  },
  addMenuItem(
    token: string,
    restaurantId: string,
    input: { name: string; price: number; currency: string },
  ): Promise<MenuItemDTO> {
    return request(`/api/restaurants/${restaurantId}/menu`, {
      method: "POST",
      token,
      body: JSON.stringify(input),
    });
  },
  addToCart(token: string, menuItemId: string, quantity = 1): Promise<CartView> {
    return request("/api/cart/items", {
      method: "POST",
      token,
      body: JSON.stringify({ menuItemId, quantity }),
    });
  },
  removeFromCart(token: string, menuItemId: string): Promise<CartView> {
    return request(`/api/cart/items/${menuItemId}`, { method: "DELETE", token });
  },
  async viewCart(token: string): Promise<CartView | null> {
    const result = await request<CartView | { cart: null }>("/api/cart", { token });
    return "cart" in result ? null : result;
  },
  checkout(token: string): Promise<{ id: string; status: string }> {
    return request("/api/checkout", { method: "POST", token });
  },
  trackOrder(token: string, orderId: string): Promise<OrderTrackingDTO> {
    return request(`/api/orders/${orderId}`, { token });
  },
  myOrders(token: string): Promise<OrderDTO[]> {
    return request("/api/orders", { token });
  },
  restaurantOrders(token: string, restaurantId: string): Promise<OrderDTO[]> {
    return request(`/api/restaurants/${restaurantId}/orders`, { token });
  },
  deliveries(token: string): Promise<OrderDTO[]> {
    return request("/api/deliveries", { token });
  },
  changeOrderStatus(token: string, orderId: string, action: OrderAction): Promise<OrderDTO> {
    return request(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ action }),
    });
  },
  listDeliverers(token: string): Promise<AuthUser[]> {
    return request("/api/deliverers", { token });
  },
  assignDeliverer(token: string, orderId: string, delivererId: string): Promise<OrderDTO> {
    return request(`/api/orders/${orderId}/deliverer`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ delivererId }),
    });
  },
};
