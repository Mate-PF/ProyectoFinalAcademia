import { MenuItem, Money } from "@proyecto/domain";
import type { MenuItemRepository } from "@proyecto/domain";
import { prisma } from "./client";

export class PrismaMenuItemRepository implements MenuItemRepository {
  async save(item) {
    const data = {
      restaurantId: item.restaurantId,
      name: item.name,
      priceCents: item.price.cents,
      currency: item.price.currency,
      available: item.available,
    };
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: data,
      create: { id: item.id, ...data },
    });
  }

  async findById(id) {
    const row = await prisma.menuItem.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findByRestaurant(restaurantId) {
    const rows = await prisma.menuItem.findMany({ where: { restaurantId } });
    return rows.map(toDomain);
  }
}

function toDomain(row) {
  return MenuItem.create({
    id: row.id,
    restaurantId: row.restaurantId,
    name: row.name,
    price: Money.fromCents(row.priceCents, row.currency),
    available: row.available,
  });
}
