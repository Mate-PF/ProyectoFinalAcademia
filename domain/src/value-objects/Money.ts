// Código ISO 4217: 3 letras (ej. "ARS", "USD", "EUR").
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

/**
 * Value Object que representa un monto de dinero.
 *
 * Decisiones de diseño (arquitectura limpia + Clean Code):
 * - Es INMUTABLE: cada operación devuelve un nuevo `Money`, nunca muta el actual.
 * - Guarda el monto en unidades mínimas (centavos) como ENTERO, para evitar los
 *   errores de coma flotante clásicos (0.1 + 0.2 !== 0.3).
 * - No tiene identidad: dos `Money` con el mismo monto y moneda son "iguales"
 *   (semántica de value object), a diferencia de una entidad que se compara por id.
 * - Valida su invariante al construirse (moneda válida, monto finito), así es
 *   imposible tener un `Money` en estado inválido.
 */
export class Money {
  private constructor(
    /** Monto en unidades mínimas (centavos). Siempre entero. */
    public readonly cents: number,
    /** Código ISO 4217 normalizado (mayúsculas), ej. "ARS". */
    public readonly currency: string,
  ) {}

  /** Crea un `Money` desde un monto decimal, ej. `Money.fromDecimal(10.99, "ARS")`. */
  static fromDecimal(amount: number, currency: string): Money {
    if (!Number.isFinite(amount)) {
      throw new Error(`Monto inválido: ${amount}`);
    }
    // Math.round evita que 19.99 * 100 = 1998.9999… quede en 1998.
    return new Money(Math.round(amount * 100), Money.normalizeCurrency(currency));
  }

  /** Crea un `Money` desde centavos enteros, ej. `Money.fromCents(1099, "ARS")`. */
  static fromCents(cents: number, currency: string): Money {
    if (!Number.isInteger(cents)) {
      throw new Error(`Los centavos deben ser un entero: ${cents}`);
    }
    return new Money(cents, Money.normalizeCurrency(currency));
  }

  private static normalizeCurrency(currency: string): string {
    const normalized = currency.trim().toUpperCase();
    if (!CURRENCY_PATTERN.test(normalized)) {
      throw new Error(`Moneda inválida: "${currency}" (se espera código ISO de 3 letras)`);
    }
    return normalized;
  }

  /** Monto como decimal (derivado de los centavos). */
  get amount(): number {
    return this.cents / 100;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.cents + other.cents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.cents - other.cents, this.currency);
  }

  /** Multiplica por un factor (ej. la cantidad de un ítem). Redondea al centavo. */
  multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new Error(`Factor inválido: ${factor}`);
    }
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  /** Representación legible, ej. "ARS 10.99". */
  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `No se pueden operar montos de distinta moneda: ${this.currency} vs ${other.currency}`,
      );
    }
  }
}
