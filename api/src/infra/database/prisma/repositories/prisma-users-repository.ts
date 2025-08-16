import { injectable, inject } from "tsyringe";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User } from "@/domain/user/enterprise/entities/user";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaClient } from "../../../../../generated/prisma";

@injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    @inject("PrismaClient")
    private prisma: PrismaClient
  ) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const totalItems = await this.prisma.user.count({ where: { companyId } });

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const users = await this.prisma.user.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: { createdAt: "desc" },
    });

    const totalAdmin = await this.prisma.user.count({ where: { companyId } });

    const totalManager = await this.prisma.user.count({ where: { companyId } });

    const totalEmployee = await this.prisma.user.count({
      where: { companyId },
    });

    const totalActive = await this.prisma.user.count({ where: { companyId } });

    const totalInactive = totalItems - totalActive;

    const lastCreatedRecord = await this.prisma.user.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    const lastCreated = lastCreatedRecord?.createdAt || new Date();

    return {
      data: users.map(PrismaUserMapper.toDomain),
      meta: {
        totalItems,
        itemCount: users.length,
        itemsPerPage,
        totalPages,
        currentPage: page,
        totalAdmin,
        totalManager,
        totalEmployee,
        totalActive,
        totalInactive,
        lastCreated,
      },
    };
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: PrismaUserMapper.toPrisma(user),
    });

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}
