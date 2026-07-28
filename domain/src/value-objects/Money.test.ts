import { describe, it, expect } from "vitest";
import { Money } from "./Money";

describe("Money", () => {
  describe("creación", () => {
    it("crea un monto desde decimal y expone centavos, moneda y monto", () => {
      const price = Money.fromDecimal(10.99, "ARS");
      expect(price.cents).toBe(1099);
      expect(price.currency).toBe("ARS");
      expect(price.amount).toBe(10.99);
    });

    it("evita el error de coma flotante al pasar a centavos", () => {
      // 19.99 * 100 en float da 1998.9999999999998; debe quedar 1999.
      expect(Money.fromDecimal(19.99, "USD").cents).toBe(1999);
    });

    it("normaliza la moneda (recorta espacios y pasa a mayúsculas)", () => {
      expect(Money.fromDecimal(1, " ars ").currency).toBe("ARS");
    });

    it("rechaza una moneda inválida", () => {
      expect(() => Money.fromDecimal(1, "peso")).toThrow();
      expect(() => Money.fromDecimal(1, "")).toThrow();
    });

    it("rechaza un monto no finito", () => {
      expect(() => Money.fromDecimal(Number.NaN, "ARS")).toThrow();
      expect(() => Money.fromDecimal(Infinity, "ARS")).toThrow();
    });

    it("fromCents exige un entero", () => {
      expect(() => Money.fromCents(10.5, "ARS")).toThrow();
      expect(Money.fromCents(1099, "ARS").cents).toBe(1099);
    });
  });

  describe("igualdad (semántica de value object)", () => {
    it("mismo monto y misma moneda son iguales", () => {
      expect(Money.fromCents(500, "ARS").equals(Money.fromCents(500, "ARS"))).toBe(true);
    });

    it("distinto monto o distinta moneda no son iguales", () => {
      expect(Money.fromCents(500, "ARS").equals(Money.fromCents(501, "ARS"))).toBe(false);
      expect(Money.fromCents(500, "ARS").equals(Money.fromCents(500, "USD"))).toBe(false);
    });
  });

  describe("operaciones", () => {
    it("suma dos montos de la misma moneda", () => {
      const total = Money.fromDecimal(10, "ARS").add(Money.fromDecimal(2.5, "ARS"));
      expect(total.equals(Money.fromDecimal(12.5, "ARS"))).toBe(true);
    });

    it("resta dos montos de la misma moneda", () => {
      const rest = Money.fromDecimal(10, "ARS").subtract(Money.fromDecimal(2.5, "ARS"));
      expect(rest.cents).toBe(750);
    });

    it("multiplica por una cantidad", () => {
      const line = Money.fromDecimal(3.33, "ARS").multiply(3);
      expect(line.cents).toBe(999);
    });

    it("es inmutable: operar no muta el original", () => {
      const price = Money.fromDecimal(10, "ARS");
      price.add(Money.fromDecimal(5, "ARS"));
      expect(price.cents).toBe(1000);
    });

    it("no permite operar montos de distinta moneda", () => {
      expect(() => Money.fromDecimal(10, "ARS").add(Money.fromDecimal(10, "USD"))).toThrow();
      expect(() => Money.fromDecimal(10, "ARS").subtract(Money.fromDecimal(10, "USD"))).toThrow();
    });
  });

  describe("consultas y formato", () => {
    it("clasifica positivo / cero / negativo", () => {
      expect(Money.fromCents(1, "ARS").isPositive()).toBe(true);
      expect(Money.fromCents(0, "ARS").isZero()).toBe(true);
      expect(Money.fromCents(-1, "ARS").isNegative()).toBe(true);
    });

    it("se muestra de forma legible", () => {
      expect(Money.fromDecimal(10.9, "ARS").toString()).toBe("ARS 10.90");
    });
  });
});
