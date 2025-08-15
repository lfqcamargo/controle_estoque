import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma";
import { PrismaTempCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-temp-companies-repository";
import { PrismaCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { HashGeneratorHandler } from "@/infra/cryptography/hash-generator-handler";
import { TempCompaniesRepository } from "@/domain/user/application/repositories/temp-companies-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { HashGenerator } from "@/domain/shared/cryptography/hash-generator";

// Registra o PrismaClient como singleton
container.registerInstance(PrismaClient, new PrismaClient());

// Registra os repositórios
container.registerSingleton<TempCompaniesRepository>(
  "TempCompaniesRepository",
  PrismaTempCompaniesRepository
);

container.registerSingleton<CompaniesRepository>(
  "CompaniesRepository",
  PrismaCompaniesRepository
);

container.registerSingleton<UsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);

// Registra o HashGenerator
container.registerSingleton<HashGenerator>(
  "HashGenerator",
  HashGeneratorHandler
);

export { container };
