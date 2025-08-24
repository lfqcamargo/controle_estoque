import {
  PasswordToken as PrismaPasswordTokens,
  Prisma,
} from 'generated/prisma';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PasswordToken } from '@/domain/user/enterprise/entities/password-token';

export class PrismaPasswordTokenMapper {
  static toDomain(raw: PrismaPasswordTokens): PasswordToken {
    return PasswordToken.create(
      {
        token: raw.token,
        expiration: raw.expiration,
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    passwordTokens: PasswordToken,
  ): Prisma.PasswordTokenUncheckedCreateInput {
    return {
      id: passwordTokens.id.toString(),
      token: passwordTokens.token,
      expiration: passwordTokens.expiration,
      userId: passwordTokens.userId.toString(),
    };
  }
}
