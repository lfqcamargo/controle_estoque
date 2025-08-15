import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/user/enterprise/entities/user";
import {
  User as PrismaUser,
  Prisma,
  UserRole as PrismaUserRole,
} from "generated/prisma";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
        companyId: new UniqueEntityID(raw.companyId),
        active: raw.active,
        createdAt: raw.createdAt,
        lastLogin: raw.lastLogin ?? null,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as PrismaUserRole,
      active: user.active,
      companyId: user.companyId.toString(),
      lastLogin: user.lastLogin ?? null,
    };
  }
}
