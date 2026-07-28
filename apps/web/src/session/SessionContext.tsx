import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { api, type AuthUser } from "../api/client";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface Session {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const SessionContext = createContext<Session | null>(null);
const STORAGE_KEY = "pedidos.session";

interface Stored {
  token: string;
  user: AuthUser;
}

function loadStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : (JSON.parse(raw) as Stored);
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadStored()?.token ?? null);
  const [user, setUser] = useState<AuthUser | null>(() => loadStored()?.user ?? null);

  const persist = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await api.login({ email, password });
      persist(result.token, result.user);
    },
    [persist],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await api.register(input);
      // Auto-login tras registrarse.
      const result = await api.login({ email: input.email, password: input.password });
      persist(result.token, result.user);
    },
    [persist],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SessionContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (ctx === null) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  return ctx;
}
