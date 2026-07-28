import { useState, type FormEvent } from "react";

export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
  error?: string;
  loading?: boolean;
}

/** Formulario de login controlado. La lógica de red vive afuera (via onSubmit). */
export function LoginForm({ onSubmit, error, loading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Iniciar sesión">
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Contraseña
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error !== undefined && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
