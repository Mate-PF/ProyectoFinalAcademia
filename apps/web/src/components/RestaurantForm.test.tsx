import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestaurantForm } from "./RestaurantForm";

describe("RestaurantForm", () => {
  it("envía nombre y dirección", async () => {
    const onSubmit = vi.fn();
    render(<RestaurantForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Nombre"), "La Pizzería");
    await userEvent.type(screen.getByLabelText("Calle"), "Corrientes");
    await userEvent.type(screen.getByLabelText("Número"), "1000");
    await userEvent.type(screen.getByLabelText("Ciudad"), "CABA");
    await userEvent.type(screen.getByLabelText("Código postal"), "1043");
    await userEvent.click(screen.getByRole("button", { name: "Crear restaurante" }));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "La Pizzería",
      street: "Corrientes",
      number: "1000",
      city: "CABA",
      postalCode: "1043",
    });
  });
});
