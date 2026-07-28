import { useState, type FormEvent } from "react";
import { inputClass, primaryButtonClass } from "../ui";

export type Role = "CLIENTE" | "REPARTIDOR" | "ADMIN";

export interface RegisterFormProps {
  onSubmit: (input: { name: string; email: string; password: string; role: Role }) => void;
  error?: string;
  loading?: boolean;
}

const ROLES: { value: Role; label: string }[] = [
  { value: "CLIENTE", label: "Cliente" },
  { value: "REPARTIDOR", label: "Repartidor" },
  { value: "ADMIN", label: "Administrador (restaurante)" },
];

export function RegisterForm({ onSubmit, error, loading = false }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CLIENTE");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name, email, password, role });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Crear cuenta" className="space-y-5 rounded-2xl bg-surface p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-fg">Crear cuenta</h2>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-fg">Nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-fg">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-fg">Contraseña</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-fg">Rol</span>
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputClass}>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      {error !== undefined && (
        <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Creando…" : "Registrarme"}
      </button>
    </form>
  );
}
