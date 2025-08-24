import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Logout (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[GET] /users/logout', async () => {
    const response = await request(app.getHttpServer()).get('/users/logout');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Logged out' });
  });
});
