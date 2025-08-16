import { injectable, inject } from "tsyringe";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { Company } from "@/domain/user/enterprise/entities/company";
import { PrismaCompanyMapper } from "../mappers/prisma-company-mapper";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaClient } from "../../../../../generated/prisma";

@injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(
    @inject("PrismaClient")
    private prisma: PrismaClient
  ) {}

  async create(company: Company): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.company.create({
        data: PrismaCompanyMapper.toPrisma(company),
      });

      for (const user of company.users) {
        await tx.user.create({
          data: PrismaUserMapper.toPrisma(user),
        });
      }
    });
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    return company ? PrismaCompanyMapper.toDomain(company) : null;
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { cnpj },
    });
    return company ? PrismaCompanyMapper.toDomain(company) : null;
  }

  async save(company: Company): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: company.id.toString() },
        data: PrismaCompanyMapper.toPrisma(company),
      });
    });
  }
}
