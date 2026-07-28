import { useState, type FormEvent } from "react";

export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
  error?: string;
  loading?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

export function LoginForm({ onSubmit, error, loading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Iniciar sesión" className="space-y-5 rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-neutral-900">Iniciar sesión</h2>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-neutral-700">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-neutral-700">Contraseña</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </label>

      {error !== undefined && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
