import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { api, type AuthUser } from "./api/client";

export function App() {
  const [error, setError] = useState<string>();
  const [user, setUser] = useState<AuthUser>();

  async function handleLogin(credentials: { email: string; password: string }) {
    setError(undefined);
    try {
      const result = await api.login(credentials);
      setUser(result.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    }
  }

  if (user !== undefined) {
    return (
      <p>
        Hola {user.name} ({user.role})
      </p>
    );
  }
  return <LoginForm onSubmit={handleLogin} error={error} />;
}
