import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  User,
  UserProps,
  UserRole,
} from '@/domain/user/enterprise/entities/user';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/infra/database/prisma/prisma.service';
import { PrismaUserMapper } from '../../src/infra/database/prisma/mappers/prisma-user-mapper';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      role: UserRole.ADMIN,
      companyId: new UniqueEntityID(faker.string.uuid()),
      createdAt: new Date(),
      lastLogin: new Date(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
