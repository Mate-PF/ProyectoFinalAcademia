import { useState, type FormEvent } from "react";

export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
  error?: string;
  loading?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-border px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

export function LoginForm({ onSubmit, error, loading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Iniciar sesión" className="space-y-5 rounded-2xl bg-surface p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-fg">Iniciar sesión</h2>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-fg">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-fg">Contraseña</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </label>

      {error !== undefined && (
        <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
