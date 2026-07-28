import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cart } from "./Cart";
import type { CartLine } from "../api/client";

const lines: CartLine[] = [
  {
    menuItemId: "a",
    name: "Muzza",
    unitPrice: { amount: 1500, currency: "ARS" },
    quantity: 2,
    subtotal: { amount: 3000, currency: "ARS" },
  },
];

describe("Cart", () => {
  it("muestra las líneas, cantidad, subtotal y total", () => {
    render(<Cart items={lines} total={{ amount: 3000, currency: "ARS" }} />);
    expect(screen.getByText("Muzza")).toBeInTheDocument();
    expect(screen.getByText("×2")).toBeInTheDocument();
    expect(screen.getByText("Total: ARS 3000.00")).toBeInTheDocument();
  });

  it("muestra el estado de carga", () => {
    render(<Cart items={[]} total={null} loading />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("muestra el mensaje de vacío", () => {
    render(<Cart items={[]} total={null} />);
    expect(screen.getByText(/vacío/i)).toBeInTheDocument();
  });

  it("Quitar llama onRemove con el id", async () => {
    const onRemove = vi.fn();
    render(<Cart items={lines} total={null} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole("button", { name: "Quitar" }));
    expect(onRemove).toHaveBeenCalledWith("a");
  });

  it("Confirmar pedido llama onCheckout", async () => {
    const onCheckout = vi.fn();
    render(<Cart items={lines} total={null} onCheckout={onCheckout} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    expect(onCheckout).toHaveBeenCalledOnce();
  });
});
