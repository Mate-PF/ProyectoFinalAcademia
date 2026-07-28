import { Restaurant, Address } from "@proyecto/domain";
import type { RestaurantRepository } from "@proyecto/domain";
import { prisma } from "./client";

export class PrismaRestaurantRepository implements RestaurantRepository {
  async save(restaurant) {
    const data = {
      name: restaurant.name,
      ownerId: restaurant.ownerId,
      street: restaurant.address.street,
      number: restaurant.address.number,
      city: restaurant.address.city,
      postalCode: restaurant.address.postalCode,
    };
    await prisma.restaurant.upsert({
      where: { id: restaurant.id },
      update: data,
      create: { id: restaurant.id, ...data },
    });
  }

  async findById(id) {
    const row = await prisma.restaurant.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findAll() {
    const rows = await prisma.restaurant.findMany();
    return rows.map(toDomain);
  }
}

function toDomain(row) {
  return Restaurant.create({
    id: row.id,
    name: row.name,
    ownerId: row.ownerId,
    address: Address.create({
      street: row.street,
      number: row.number,
      city: row.city,
      postalCode: row.postalCode,
    }),
  });
}
