import type { Money, Restaurant, MenuItem, CartItem, Order, User } from "@proyecto/domain";

/** Serializadores de entidades del dominio a JSON para las respuestas HTTP. */

export function moneyToJson(money: Money) {
  return { amount: money.amount, currency: money.currency };
}

export function userToJson(user: User) {
  return { id: user.id, name: user.name, email: user.email.value, role: user.role };
}

export function restaurantToJson(r: Restaurant) {
  return {
    id: r.id,
    name: r.name,
    ownerId: r.ownerId,
    address: {
      street: r.address.street,
      number: r.address.number,
      city: r.address.city,
      postalCode: r.address.postalCode,
    },
  };
}

export function menuItemToJson(item: MenuItem) {
  return {
    id: item.id,
    restaurantId: item.restaurantId,
    name: item.name,
    price: moneyToJson(item.price),
    available: item.available,
  };
}

export function cartItemToJson(ci: CartItem) {
  return {
    menuItemId: ci.menuItemId,
    name: ci.menuItem.name,
    unitPrice: moneyToJson(ci.menuItem.price),
    quantity: ci.quantity,
    subtotal: moneyToJson(ci.subtotal()),
  };
}

export function cartToJson(input: {
  cartId: string;
  restaurantId: string;
  items: readonly CartItem[];
  total: Money | null;
}) {
  return {
    cartId: input.cartId,
    restaurantId: input.restaurantId,
    items: input.items.map(cartItemToJson),
    total: input.total === null ? null : moneyToJson(input.total),
  };
}

export function orderToJson(o: Order) {
  return {
    id: o.id,
    customerId: o.customerId,
    restaurantId: o.restaurantId,
    status: o.status,
    delivererId: o.delivererId,
    total: moneyToJson(o.total()),
    items: o.items.map((i) => ({
      menuItemId: i.menuItemId,
      name: i.name,
      unitPrice: moneyToJson(i.unitPrice),
      quantity: i.quantity,
    })),
  };
}
