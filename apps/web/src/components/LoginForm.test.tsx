import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("envía email y contraseña al hacer submit", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email"), "juan@example.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "supersecret");
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(onSubmit).toHaveBeenCalledWith({ email: "juan@example.com", password: "supersecret" });
  });

  it("muestra el mensaje de error", () => {
    render(<LoginForm onSubmit={vi.fn()} error="Credenciales inválidas" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Credenciales inválidas");
  });

  it("deshabilita el botón mientras carga", () => {
    render(<LoginForm onSubmit={vi.fn()} loading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
