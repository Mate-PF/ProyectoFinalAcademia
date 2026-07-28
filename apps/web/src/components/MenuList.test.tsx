import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuList } from "./MenuList";
import type { MenuItemDTO } from "../api/client";

const items: MenuItemDTO[] = [
  { id: "a", restaurantId: "r", name: "Muzza", price: { amount: 1500, currency: "ARS" }, available: true },
  { id: "b", restaurantId: "r", name: "Napo", price: { amount: 1800, currency: "ARS" }, available: false },
];

describe("MenuList", () => {
  it("muestra los ítems con nombre y precio", () => {
    render(<MenuList items={items} />);
    expect(screen.getByText("Muzza")).toBeInTheDocument();
    expect(screen.getByText("ARS 1500.00")).toBeInTheDocument();
  });

  it("muestra el estado de carga", () => {
    render(<MenuList items={[]} loading />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("muestra el mensaje de vacío", () => {
    render(<MenuList items={[]} emptyMessage="Menú vacío" />);
    expect(screen.getByText("Menú vacío")).toBeInTheDocument();
  });

  it("al tocar Agregar llama onAdd con el id del ítem", async () => {
    const onAdd = vi.fn();
    render(<MenuList items={items} onAdd={onAdd} />);
    await userEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(onAdd).toHaveBeenCalledWith("a");
  });

  it("un ítem no disponible tiene el botón deshabilitado", () => {
    render(<MenuList items={items} onAdd={vi.fn()} />);
    expect(screen.getByRole("button", { name: "No disponible" })).toBeDisabled();
  });
});
