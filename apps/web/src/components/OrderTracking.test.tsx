import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTracking } from "./OrderTracking";
import type { OrderTrackingDTO } from "../api/client";

const base: OrderTrackingDTO = {
  orderId: "o-1",
  status: "CONFIRMADO",
  total: { amount: 3000, currency: "ARS" },
  delivererId: null,
};

describe("OrderTracking", () => {
  it("muestra el estado legible y el total", () => {
    render(<OrderTracking tracking={base} />);
    expect(screen.getByText("Confirmado")).toBeInTheDocument();
    expect(screen.getByText(/ARS 3000.00/)).toBeInTheDocument();
  });

  it("muestra el repartidor cuando está asignado", () => {
    render(<OrderTracking tracking={{ ...base, status: "EN_CAMINO", delivererId: "rep-9" }} />);
    expect(screen.getByText(/rep-9/)).toBeInTheDocument();
  });

  it("no muestra repartidor si no hay", () => {
    render(<OrderTracking tracking={base} />);
    expect(screen.queryByText(/Repartidor:/)).not.toBeInTheDocument();
  });
});
