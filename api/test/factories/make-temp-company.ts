import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  TempCompany,
  TempCompanyProps,
} from '@/domain/user/enterprise/entities/temp-company';
import { PrismaTempCompanyMapper } from '@/infra/database/prisma/mappers/prisma-temp-company-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeTempCompany(
  override: Partial<TempCompanyProps> = {},
  id?: UniqueEntityID,
) {
  const tempCompany = TempCompany.create(
    {
      cnpj: faker.string.numeric(14),
      companyName: faker.company.name(),
      email: faker.internet.email(),
      userName: faker.person.fullName(),
      password: faker.internet.password(),
      token: faker.string.uuid(),
      expiration: faker.date.future(),
      ...override,
    },
    id,
  );

  return tempCompany;
}

@Injectable()
export class TempCompanyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompany(
    data: Partial<TempCompanyProps> = {},
  ): Promise<TempCompany> {
    const tempCompany = makeTempCompany(data);

    await this.prisma.tempCompany.create({
      data: PrismaTempCompanyMapper.toPrisma(tempCompany),
    });

    return tempCompany;
  }
}
