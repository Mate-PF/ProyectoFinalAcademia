import { Order, OrderItem, Money } from "@proyecto/domain";
import type { OrderRepository } from "@proyecto/domain";
import { prisma } from "./client";

export class PrismaOrderRepository implements OrderRepository {
  async save(order) {
    // Las líneas del pedido son inmutables (se fijan en el checkout): solo se
    // crean junto con el pedido; en updates solo cambia status/delivererId.
    await prisma.order.upsert({
      where: { id: order.id },
      update: { status: order.status, delivererId: order.delivererId },
      create: {
        id: order.id,
        customerId: order.customerId,
        restaurantId: order.restaurantId,
        status: order.status,
        delivererId: order.delivererId,
        items: {
          create: order.items.map((oi) => ({
            menuItemId: oi.menuItemId,
            name: oi.name,
            unitPriceCents: oi.unitPrice.cents,
            currency: oi.unitPrice.currency,
            quantity: oi.quantity,
          })),
        },
      },
    });
  }

  async findById(id) {
    const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    return row ? toDomain(row) : null;
  }

  async findByCustomer(customerId) {
    const rows = await prisma.order.findMany({ where: { customerId }, include: { items: true } });
    return rows.map(toDomain);
  }

  async findByRestaurant(restaurantId) {
    const rows = await prisma.order.findMany({ where: { restaurantId }, include: { items: true } });
    return rows.map(toDomain);
  }

  async findByDeliverer(delivererId) {
    const rows = await prisma.order.findMany({ where: { delivererId }, include: { items: true } });
    return rows.map(toDomain);
  }
}

function toDomain(row) {
  const items = row.items.map((oi) =>
    OrderItem.create({
      menuItemId: oi.menuItemId,
      name: oi.name,
      unitPrice: Money.fromCents(oi.unitPriceCents, oi.currency),
      quantity: oi.quantity,
    }),
  );
  return Order.rehydrate({
    id: row.id,
    customerId: row.customerId,
    restaurantId: row.restaurantId,
    items,
    status: row.status,
    delivererId: row.delivererId,
  });
}
