import { Injectable } from '@nestjs/common';

import { DomainEvents } from '@/core/events/domain-events';
import { PasswordTokensRepositoryInterface } from '@/domain/user/application/interfaces/password-tokens-repository-interface';
import { PasswordToken } from '@/domain/user/enterprise/entities/password-token';

import { PrismaPasswordTokenMapper } from '../mappers/prisma-password-token-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPasswordTokensRepository
  implements PasswordTokensRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async create(passwordToken: PasswordToken): Promise<void> {
    await this.prisma.passwordToken.create({
      data: PrismaPasswordTokenMapper.toPrisma(passwordToken),
    });

    DomainEvents.dispatchEventsForAggregate(passwordToken.id);
  }

  async findByToken(token: string): Promise<PasswordToken | null> {
    const passwordToken = await this.prisma.passwordToken.findFirst({
      where: { token },
    });
    return passwordToken
      ? PrismaPasswordTokenMapper.toDomain(passwordToken)
      : null;
  }

  async deleteByToken(passwordToken: string): Promise<void> {
    await this.prisma.passwordToken.delete({
      where: { id: passwordToken },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.passwordToken.delete({
      where: { id: userId },
    });
  }
}
