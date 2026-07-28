const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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
  price: { amount: number; currency: string };
  available: boolean;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
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
  listMenu(restaurantId: string): Promise<MenuItemDTO[]> {
    return request(`/api/restaurants/${restaurantId}/menu`);
  },
};
