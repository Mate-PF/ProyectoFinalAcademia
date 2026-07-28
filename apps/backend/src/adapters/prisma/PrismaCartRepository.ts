import { Cart, CartItem, MenuItem, Money } from "@proyecto/domain";
import type { CartRepository } from "@proyecto/domain";
import { prisma } from "./client";

export class PrismaCartRepository implements CartRepository {
  async save(cart) {
    // Reemplaza las líneas por completo (el carrito es de un cliente).
    await prisma.$transaction([
      prisma.cart.upsert({
        where: { id: cart.id },
        update: { customerId: cart.customerId, restaurantId: cart.restaurantId },
        create: { id: cart.id, customerId: cart.customerId, restaurantId: cart.restaurantId },
      }),
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
      prisma.cartItem.createMany({
        data: cart.items.map((ci) => ({
          cartId: cart.id,
          menuItemId: ci.menuItemId,
          quantity: ci.quantity,
        })),
      }),
    ]);
  }

  async findByCustomer(customerId) {
    const row = await prisma.cart.findUnique({
      where: { customerId },
      include: { items: { include: { menuItem: true } } },
    });
    if (!row) return null;

    const items = row.items.map((ci) =>
      CartItem.create(
        MenuItem.create({
          id: ci.menuItem.id,
          restaurantId: ci.menuItem.restaurantId,
          name: ci.menuItem.name,
          price: Money.fromCents(ci.menuItem.priceCents, ci.menuItem.currency),
          available: ci.menuItem.available,
        }),
        ci.quantity,
      ),
    );

    return Cart.rehydrate(
      { id: row.id, customerId: row.customerId, restaurantId: row.restaurantId },
      items,
    );
  }
}
