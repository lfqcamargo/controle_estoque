import { beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { TempCompanyFactory } from 'test/factories/make-temp-company';

describe('Confirmation Create Company (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tempFactory: TempCompanyFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TempCompanyFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    tempFactory = moduleRef.get(TempCompanyFactory);

    await app.init();
  });

  test('[GET] /companies/token/:token', async () => {
    const tempCompany = await tempFactory.makePrismaCompany();

    const response = await request(app.getHttpServer()).get(
      `/companies/token/${tempCompany.token}`,
    );

    expect(response.statusCode).toBe(201);

    const company = await prisma.company.findUnique({
      where: {
        cnpj: tempCompany.cnpj,
      },
      include: {
        users: true,
      },
    });

    expect(response.body.email).toBe(tempCompany.email);
    expect(company).toBeTruthy();
    expect(company?.cnpj).toBe(tempCompany.cnpj);
    expect(company?.name).toBe(tempCompany.companyName);
    expect(company?.users[0]!).toBeTruthy();
    expect(company?.users[0]!.email).toBe(tempCompany.email);
    expect(company?.users[0]!.name).toBe(tempCompany.userName);
    expect(company?.users[0]!.role).toBe('ADMIN');
  });
});
