import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderList } from "./OrderList";
import type { OrderDTO } from "../api/client";

const orders: OrderDTO[] = [
  {
    id: "abcdef123456",
    customerId: "c",
    restaurantId: "r",
    status: "PENDIENTE",
    delivererId: null,
    total: { amount: 3000, currency: "ARS" },
    items: [{ menuItemId: "m", name: "Muzza", unitPrice: { amount: 1500, currency: "ARS" }, quantity: 2 }],
  },
];

describe("OrderList", () => {
  it("muestra estado, ítems y total", () => {
    render(<OrderList orders={orders} />);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText(/2× Muzza/)).toBeInTheDocument();
    expect(screen.getByText("ARS 3000.00")).toBeInTheDocument();
  });

  it("muestra el mensaje de vacío", () => {
    render(<OrderList orders={[]} emptyMessage="Sin pedidos" />);
    expect(screen.getByText("Sin pedidos")).toBeInTheDocument();
  });

  it("renderiza las acciones inyectadas", () => {
    render(<OrderList orders={orders} renderActions={() => <button type="button">Confirmar</button>} />);
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
  });
});
