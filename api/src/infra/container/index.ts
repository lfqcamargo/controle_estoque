import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma";
import { PrismaTempCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-temp-companies-repository";
import { PrismaCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { PrismaEmailsRepository } from "@/infra/database/prisma/repositories/prisma-emails-repository";
import { HashGeneratorHandler } from "@/infra/cryptography/hash-generator-handler";
import { ResendEmailService } from "@/infra/notification/email/resend-email-service";
import { TempCompaniesRepository } from "@/domain/user/application/repositories/temp-companies-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { EmailsRepository } from "@/domain/notification/application/repositories/emails-repository";
import { HashGenerator } from "@/domain/shared/cryptography/hash-generator";
import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { SendEmailUseCase } from "@/domain/notification/application/use-cases/send-email";
import { OnTempCompanyCreated } from "@/domain/notification/application/subscribers/on-temp-company-created";
import { CreateTempCompanyUseCase } from "@/domain/user/application/use-cases/create-temp-company";

container.registerInstance<PrismaClient>("PrismaClient", new PrismaClient());

//Use-cases
container.registerSingleton<CreateTempCompanyUseCase>(
  "CreateTempCompanyUseCase",
  CreateTempCompanyUseCase
);

//Repositories
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

container.registerSingleton<EmailsRepository>(
  "EmailsRepository",
  PrismaEmailsRepository
);

// Shared
container.registerSingleton<HashGenerator>(
  "HashGenerator",
  HashGeneratorHandler
);

// Notification
container.registerSingleton<EmailSender>("EmailSender", ResendEmailService);

container.registerSingleton<SendEmailUseCase>(
  "SendEmailUseCase",
  SendEmailUseCase
);

container.registerSingleton<OnTempCompanyCreated>(
  "OnTempCompanyCreated",
  OnTempCompanyCreated
);

//Dispatch
container.resolve(OnTempCompanyCreated);

export { container };
