import { User, Email } from "@proyecto/domain";
import type { UserRepository } from "@proyecto/domain";
import { prisma } from "./client";

export class PrismaUserRepository implements UserRepository {
  async save(user) {
    const data = {
      name: user.name,
      email: user.email.value,
      role: user.role,
      passwordHash: user.passwordHash,
    };
    await prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: { id: user.id, ...data },
    });
  }

  async findByEmail(email) {
    const row = await prisma.user.findUnique({ where: { email: email.value } });
    return row ? toDomain(row) : null;
  }

  async findById(id) {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findByRole(role) {
    const rows = await prisma.user.findMany({ where: { role } });
    return rows.map(toDomain);
  }
}

function toDomain(row) {
  return User.create({
    id: row.id,
    name: row.name,
    email: Email.create(row.email),
    role: row.role,
    passwordHash: row.passwordHash,
  });
}
