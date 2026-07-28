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

  it("viewCart manda el token en Authorization y devuelve el carrito", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ cartId: "c", restaurantId: "r", items: [], total: null }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const cart = await api.viewCart("tok123");

    expect(cart?.cartId).toBe("c");
    const options = fetchMock.mock.calls[0][1] as { headers: Record<string, string> };
    expect(options.headers.Authorization).toBe("Bearer tok123");
  });

  it("viewCart devuelve null si el backend responde sin carrito", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ cart: null }) }));
    expect(await api.viewCart("t")).toBeNull();
  });
});
