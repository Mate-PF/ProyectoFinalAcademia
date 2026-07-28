import { useState, type FormEvent } from "react";
import { inputClass, primaryButtonClass } from "../ui";

export interface RestaurantFormValues {
  name: string;
  street: string;
  number: string;
  city: string;
  postalCode: string;
}

export interface RestaurantFormProps {
  onSubmit: (values: RestaurantFormValues) => void;
  error?: string;
  loading?: boolean;
}

export function RestaurantForm({ onSubmit, error, loading = false }: RestaurantFormProps) {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name, street, number, city, postalCode });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Crear restaurante" className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-900">Crear restaurante</h3>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-neutral-700">Nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Calle</span>
          <input value={street} onChange={(e) => setStreet(e.target.value)} className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Número</span>
          <input value={number} onChange={(e) => setNumber(e.target.value)} className={inputClass} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Ciudad</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Código postal</span>
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputClass} />
        </label>
      </div>
      {error !== undefined && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Creando…" : "Crear restaurante"}
      </button>
    </form>
  );
}
