import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider, useSession } from "./SessionContext";
import { api } from "../api/client";

function Probe() {
  const { user, login, logout } = useSession();
  return (
    <div>
      <p data-testid="user">{user !== null ? user.name : "none"}</p>
      <button onClick={() => void login("a@a.com", "x")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("SessionProvider", () => {
  it("login guarda el usuario y lo persiste en localStorage", async () => {
    vi.spyOn(api, "login").mockResolvedValue({
      token: "t",
      user: { id: "1", name: "Ana", email: "a@a.com", role: "ADMIN" },
    });
    render(
      <SessionProvider>
        <Probe />
      </SessionProvider>,
    );
    expect(screen.getByTestId("user")).toHaveTextContent("none");

    await userEvent.click(screen.getByText("login"));

    await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Ana"));
    expect(localStorage.getItem("pedidos.session")).toContain("Ana");
  });

  it("logout limpia la sesión", async () => {
    vi.spyOn(api, "login").mockResolvedValue({
      token: "t",
      user: { id: "1", name: "Ana", email: "a@a.com", role: "ADMIN" },
    });
    render(
      <SessionProvider>
        <Probe />
      </SessionProvider>,
    );
    await userEvent.click(screen.getByText("login"));
    await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Ana"));

    await userEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(localStorage.getItem("pedidos.session")).toBeNull();
  });
});
