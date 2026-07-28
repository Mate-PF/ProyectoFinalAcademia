import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "./CartContext";
import { SessionProvider } from "../session/SessionContext";
import { api } from "../api/client";

function Probe() {
  const { itemCount, add } = useCart();
  return (
    <div>
      <p data-testid="count">{itemCount}</p>
      <button onClick={() => void add("m1", 2)}>add</button>
    </div>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("CartContext", () => {
  it("add actualiza el conteo del carrito", async () => {
    localStorage.setItem("pedidos.session", JSON.stringify({ token: "t", user: { id: "1", name: "J", email: "j@j.com", role: "CLIENTE" } }));
    vi.spyOn(api, "viewCart").mockResolvedValue(null);
    vi.spyOn(api, "addToCart").mockResolvedValue({
      cartId: "c",
      restaurantId: "r",
      items: [{ menuItemId: "m1", name: "Muzza", unitPrice: { amount: 1500, currency: "ARS" }, quantity: 2, subtotal: { amount: 3000, currency: "ARS" } }],
      total: { amount: 3000, currency: "ARS" },
    });

    render(
      <SessionProvider>
        <CartProvider>
          <Probe />
        </CartProvider>
      </SessionProvider>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    await userEvent.click(screen.getByText("add"));
    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("2"));
  });
});
