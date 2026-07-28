import { describe, it, expect, vi, afterEach } from "vitest";
import { api } from "./client";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api client", () => {
  it("login hace POST a /api/auth/login y devuelve token + user", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "t", user: { id: "1", name: "Ana", email: "a@a.com", role: "ADMIN" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await api.login({ email: "a@a.com", password: "x" });

    expect(res.token).toBe("t");
    expect(res.user.role).toBe("ADMIN");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("lanza con el mensaje del backend cuando la respuesta falla", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Email o contraseña incorrectos" }),
      }),
    );

    await expect(api.login({ email: "a@a.com", password: "bad" })).rejects.toThrow(
      "Email o contraseña incorrectos",
    );
  });
});
