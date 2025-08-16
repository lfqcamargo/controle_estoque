import { injectable, inject } from "tsyringe";
import { TempCompaniesRepositoryInterface } from "@/domain/user/application/interfaces/temp-companies-repository-interface";
import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";
import { PrismaTempCompanyMapper } from "../mappers/prisma-temp-company-mapper";
import { PrismaClient } from "../../../../../generated/prisma";
import { DomainEvents } from "@/core/events/domain-events";

@injectable()
export class PrismaTempCompaniesRepository
  implements TempCompaniesRepositoryInterface
{
  constructor(
    @inject("PrismaClient")
    private prisma: PrismaClient
  ) {}

  async create(tempCompany: TempCompany): Promise<void> {
    await this.prisma.tempCompany.create({
      data: PrismaTempCompanyMapper.toPrisma(tempCompany),
    });

    DomainEvents.dispatchEventsForAggregate(tempCompany.id);
  }

  async findByEmail(email: string): Promise<TempCompany | null> {
    const tempCompany = await this.prisma.tempCompany.findFirst({
      where: { email },
    });
    return tempCompany ? PrismaTempCompanyMapper.toDomain(tempCompany) : null;
  }

  async findByCnpj(cnpj: string): Promise<TempCompany | null> {
    const tempCompany = await this.prisma.tempCompany.findFirst({
      where: { cnpj },
    });
    return tempCompany ? PrismaTempCompanyMapper.toDomain(tempCompany) : null;
  }

  async findByToken(token: string): Promise<TempCompany | null> {
    const tempCompany = await this.prisma.tempCompany.findFirst({
      where: { token },
    });
    return tempCompany ? PrismaTempCompanyMapper.toDomain(tempCompany) : null;
  }

  async delete(tempCompany: TempCompany): Promise<void> {
    await this.prisma.tempCompany.delete({
      where: { id: tempCompany.id.toString() },
    });
  }

  async deleteByCnpj(cnpj: string): Promise<void> {
    await this.prisma.tempCompany.deleteMany({
      where: { cnpj },
    });
  }
}
