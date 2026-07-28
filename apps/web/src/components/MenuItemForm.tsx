import { useState, type FormEvent } from "react";
import { inputClass, primaryButtonClass } from "../ui";

export interface MenuItemFormValues {
  name: string;
  price: number;
}

export interface MenuItemFormProps {
  onSubmit: (values: MenuItemFormValues) => void;
  error?: string;
  loading?: boolean;
}

export function MenuItemForm({ onSubmit, error, loading = false }: MenuItemFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name, price: Number(price) });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Agregar ítem al menú" className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-900">Agregar ítem al menú</h3>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Nombre</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Precio (ARS)</span>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputClass} w-32`}
          />
        </label>
      </div>
      {error !== undefined && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Agregando…" : "Agregar al menú"}
      </button>
    </form>
  );
}
