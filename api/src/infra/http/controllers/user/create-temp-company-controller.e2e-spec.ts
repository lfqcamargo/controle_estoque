import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create Company Temp (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  test('[POST] /companies', async () => {
    const companyData = {
      cnpj: '63241761000155',
      companyName: 'Lfqcamargo Company',
      email: 'lfqcamargo@gmail.com',
      userName: 'Lucas Camargo',
      password: '123456789Lfqcamargo@',
    };

    const response = await request(app.getHttpServer())
      .post('/companies')
      .send(companyData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({});

    const tempCompany = await prisma.tempCompany.findFirst({
      where: {
        cnpj: companyData.cnpj,
        email: companyData.email,
      },
    });

    expect(tempCompany).toBeTruthy();
    expect(tempCompany?.cnpj).toBe(companyData.cnpj);
    expect(tempCompany?.companyName).toBe(companyData.companyName);
    expect(tempCompany?.email).toBe(companyData.email);
    expect(tempCompany?.userName).toBe(companyData.userName);
    expect(tempCompany?.password).not.toBe(companyData.password);
    expect(tempCompany?.token).toBeTruthy();
    expect(tempCompany?.expiration).toBeInstanceOf(Date);
    expect(tempCompany?.expiration.getTime()).toBeGreaterThan(Date.now());
  });
});
