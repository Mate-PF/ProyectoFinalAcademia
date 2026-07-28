import type { Money } from "./api/client";

/** Formatea un monto para mostrar, ej. "ARS 1500.00". */
export function formatMoney(money: Money): string {
  return `${money.currency} ${money.amount.toFixed(2)}`;
}
