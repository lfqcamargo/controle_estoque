import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  PasswordToken,
  PasswordTokenProps,
} from '@/domain/user/enterprise/entities/password-token';
import { faker } from '@faker-js/faker';
import { makeUser } from './make-user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/infra/database/prisma/prisma.service';
import { PrismaPasswordTokenMapper } from '../../src/infra/database/prisma/mappers/prisma-password-token-mapper';
export function makePasswordToken(
  override: Partial<PasswordTokenProps> = {},
  id?: UniqueEntityID,
) {
  const passwordToken = PasswordToken.create(
    {
      token: faker.string.uuid(),
      expiration: faker.date.future(),
      userId: new UniqueEntityID(makeUser().id.toString()),
      ...override,
    },
    id,
  );

  return passwordToken;
}

@Injectable()
export class PasswordTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPasswordToken(
    data: Partial<PasswordTokenProps> = {},
  ): Promise<PasswordToken> {
    const passwordToken = makePasswordToken(data);

    await this.prisma.passwordToken.create({
      data: PrismaPasswordTokenMapper.toPrisma(passwordToken),
    });

    return passwordToken;
  }
}
