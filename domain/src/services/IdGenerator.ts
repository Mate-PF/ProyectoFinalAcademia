/**
 * Puerto para generar identificadores. Abstrae de dónde salen los ids
 * (uuid, cuid, autoincrement de la DB…), que es un detalle de infraestructura.
 */
export interface IdGenerator {
  next(): string;
}
