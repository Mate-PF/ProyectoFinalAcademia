import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./RegisterForm";

describe("RegisterForm", () => {
  it("envía nombre, email, contraseña y rol elegido", async () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.type(screen.getByLabelText("Email"), "ana@r.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "supersecret");
    await userEvent.selectOptions(screen.getByLabelText("Rol"), "ADMIN");
    await userEvent.click(screen.getByRole("button", { name: "Registrarme" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ana",
      email: "ana@r.com",
      password: "supersecret",
      role: "ADMIN",
    });
  });

  it("usa CLIENTE como rol por defecto", async () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Nombre"), "Juan");
    await userEvent.type(screen.getByLabelText("Email"), "juan@c.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "supersecret");
    await userEvent.click(screen.getByRole("button", { name: "Registrarme" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ role: "CLIENTE" }));
  });

  it("muestra el error", () => {
    render(<RegisterForm onSubmit={vi.fn()} error="Ya existe un usuario con ese email" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe un usuario");
  });
});
