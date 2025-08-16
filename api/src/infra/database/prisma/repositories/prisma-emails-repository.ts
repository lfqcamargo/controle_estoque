import { PrismaClient } from "../../../../../generated/prisma";
import { EmailsRepository } from "@/domain/notification/application/repositories/emails-repository";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { PrismaEmailMapper } from "../mappers/prisma-email-mapper";
import { injectable, inject } from "tsyringe";

@injectable()
export class PrismaEmailsRepository implements EmailsRepository {
  constructor(
    @inject(PrismaClient)
    private prisma: PrismaClient
  ) {}

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
