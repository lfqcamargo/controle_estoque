import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CompanyFactory } from 'test/factories/make-company';
import { UserFactory } from 'test/factories/make-user';
import { beforeAll, describe, expect, test } from 'vitest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Generate New Password Token (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let companyFactory: CompanyFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    companyFactory = moduleRef.get(CompanyFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[GET] /auth/forgot-password/:email', async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      email: 'lfqcamargo@gmail.com',
    });

    const response = await request(app.getHttpServer()).get(
      `/auth/forgot-password/${user.email}`,
    );

    expect(response.statusCode).toBe(200);

    const passwordToken = await prisma.passwordToken.findFirst({
      where: {
        userId: user.id.toString(),
      },
    });

    expect(passwordToken).toBeTruthy();
  });
});
