import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CompanyFactory } from 'test/factories/make-company';
import { UserFactory } from 'test/factories/make-user';
import { beforeAll, describe, expect, test } from 'vitest';

import { AppModule } from '@/infra/app.module';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { PasswordTokenFactory } from '../../../../../test/factories/make-password-token';

describe('Exchange Password For Token (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let companyFactory: CompanyFactory;
  let passwordTokenFactory: PasswordTokenFactory;
  let bcryptHasher: BcryptHasher;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        PasswordTokenFactory,
        BcryptHasher,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    companyFactory = moduleRef.get(CompanyFactory);
    passwordTokenFactory = moduleRef.get(PasswordTokenFactory);
    bcryptHasher = moduleRef.get(BcryptHasher);

    await app.init();
  });

  test('[POST] /users/password/reset/:token', async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      email: 'lfqcamargo@gmail.com',
    });

    const passwordToken = await passwordTokenFactory.makePrismaPasswordToken({
      userId: user.id,
    });

    const newPassword = '123456789Lfqcamargo@';

    const response = await request(app.getHttpServer())
      .post(`/users/password/reset/${passwordToken.token}`)
      .send({
        password: newPassword,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ email: user.email }),
    );

    const dataUser = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    });

    expect(dataUser).toBeTruthy();
    const isPasswordChanged = await bcryptHasher.compare(
      newPassword,
      dataUser!.password,
    );

    expect(isPasswordChanged).toBe(true);
    const oldPassword = 'oldpassword123';
    const isOldPasswordInvalid = await bcryptHasher.compare(
      oldPassword,
      dataUser!.password,
    );

    expect(isOldPasswordInvalid).toBe(false);
  });
});
