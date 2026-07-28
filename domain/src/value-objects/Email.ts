// Formato pragmático: algo@algo.tld, sin espacios. No pretende cubrir todo el
// RFC 5322 (eso es responsabilidad de la verificación por email en el backend);
// alcanza para rechazar entradas obviamente inválidas en el dominio.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Value Object que representa un email válido y normalizado.
 * - Inmutable y con semántica de valor (dos iguales si su `value` coincide).
 * - Normaliza al crear: recorta espacios y pasa a minúsculas, así
 *   "Juan@Mail.com" y "juan@mail.com " son el mismo email.
 * - Valida su formato al construirse: un `Email` inválido no puede existir.
 */
export class Email {
  private constructor(public readonly value: string) {}

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      throw new Error(`Email inválido: "${raw}"`);
    }
    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
