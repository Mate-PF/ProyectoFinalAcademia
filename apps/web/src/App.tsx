import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { api, type AuthUser } from "./api/client";

export function App() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser>();

  async function handleLogin(credentials: { email: string; password: string }) {
    setError(undefined);
    setLoading(true);
    try {
      const result = await api.login(credentials);
      setUser(result.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-brand text-white shadow-md">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-4">
          <span className="text-2xl">🍔</span>
          <h1 className="text-xl font-bold tracking-tight">Pedidos For-It</h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10">
        {user !== undefined ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg">
              ¡Hola <span className="font-semibold">{user.name}</span>!
            </p>
            <p className="mt-1 text-sm text-neutral-500">Rol: {user.role}</p>
          </div>
        ) : (
          <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
        )}
      </main>
    </div>
  );
}
