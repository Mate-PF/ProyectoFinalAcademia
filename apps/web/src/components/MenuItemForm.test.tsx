import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItemForm } from "./MenuItemForm";

describe("MenuItemForm", () => {
  it("envía nombre y precio numérico", async () => {
    const onSubmit = vi.fn();
    render(<MenuItemForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Nombre"), "Muzzarella");
    await userEvent.type(screen.getByLabelText("Precio (ARS)"), "1500");
    await userEvent.click(screen.getByRole("button", { name: "Agregar al menú" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Muzzarella", price: 1500 });
  });
});
