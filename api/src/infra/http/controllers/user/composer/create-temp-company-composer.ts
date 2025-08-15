import { CreateTempCompanyUseCase } from "@/domain/user/application/use-cases/create-temp-company";
import { CreateTempCompanyController } from "../create-temp-company-controller";
import { RedisTempCompaniesRepository } from "@/infra/cache/redis/repositories/redis-temp-companies-repository";
import { RedisCacheRepository } from "@/infra/cache/redis/interface/redis-cache-repository";
import { PrismaCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { HashGeneratorHandler } from "@/infra/cryptography/hash-generator-handler";
import { redisConnection } from "@/infra/cache/redis/redis-connection";
import prismaClient from "@/infra/database/prisma/prisma-client";

export function createTempCompanyComposer() {
  const cacheRepository = new RedisCacheRepository(redisConnection);
  const tempCompanyRepository = new RedisTempCompaniesRepository(
    cacheRepository,
    redisConnection
  );
  const companiesRepository = new PrismaCompaniesRepository(prismaClient);
  const usersRepository = new PrismaUsersRepository(prismaClient);
  const hashGenerator = new HashGeneratorHandler();

  const useCase = new CreateTempCompanyUseCase(
    tempCompanyRepository,
    companiesRepository,
    usersRepository,
    hashGenerator
  );
  const controller = new CreateTempCompanyController(useCase);

  return controller;
}
