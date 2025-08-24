import { Injectable } from '@nestjs/common';

import { EmailsRepositoryInterface } from '@/domain/notification/application/interfaces/emails-repository-interface';
import { Email } from '@/domain/notification/enterprise/entities/email';

import { PrismaEmailMapper } from '../mappers/prisma-email-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaEmailsRepository implements EmailsRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async create(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email);

    await this.prisma.email.create({
      data,
    });
  }

  async findById(id: string): Promise<Email | null> {
    const email = await this.prisma.email.findUnique({
      where: { id },
    });

    if (!email) {
      return null;
    }

    return PrismaEmailMapper.toDomain(email);
  }

  async save(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email);

    await this.prisma.email.update({
      where: { id: data.id },
      data,
    });
  }
}
