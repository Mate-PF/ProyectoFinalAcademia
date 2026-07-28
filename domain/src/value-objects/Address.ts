export interface AddressProps {
  street: string;
  /** Alfanumérico a propósito: admite "742", "742B", "S/N". */
  number: string;
  city: string;
  postalCode: string;
}

/**
 * Value Object que representa una dirección de entrega.
 * - Inmutable y con semántica de valor (igualdad estructural por todos sus campos).
 * - Recorta espacios y exige que ningún campo obligatorio quede vacío.
 */
export class Address {
  private constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly city: string,
    public readonly postalCode: string,
  ) {}

  static create(props: AddressProps): Address {
    return new Address(
      Address.required(props.street, "calle"),
      Address.required(props.number, "número"),
      Address.required(props.city, "ciudad"),
      Address.required(props.postalCode, "código postal"),
    );
  }

  private static required(value: string, field: string): string {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error(`La dirección requiere ${field}`);
    }
    return trimmed;
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.number === other.number &&
      this.city === other.city &&
      this.postalCode === other.postalCode
    );
  }

  toString(): string {
    return `${this.street} ${this.number}, ${this.city} (${this.postalCode})`;
  }
}
