import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma";
import { PrismaTempCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-temp-companies-repository";
import { PrismaCompaniesRepository } from "@/infra/database/prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { PrismaEmailsRepository } from "@/infra/database/prisma/repositories/prisma-emails-repository";
import { HashGeneratorHandler } from "@/infra/cryptography/hash-generator-handler";
import { ResendEmailService } from "@/infra/notification/email/resend-email-service";
import { TempCompaniesRepositoryInterface } from "@/domain/user/application/interfaces/temp-companies-repository-interface";
import { CompaniesRepositoryInterface } from "@/domain/user/application/interfaces/companies-repository-interface";
import { UsersRepositoryInterface } from "@/domain/user/application/interfaces/users-repository-interface";
import { EmailsRepositoryInterface } from "@/domain/notification/application/interfaces/emails-repository-interface";
import { HashGeneratorInterface } from "@/domain/shared/cryptography/interfaces/hash-generator-interface";
import { EmailSenderInterface } from "@/domain/notification/application/interfaces/email-sender-interface";
import { SendEmailUseCase } from "@/domain/notification/application/use-cases/send-email";
import { OnTempCompanyCreated } from "@/domain/notification/application/subscribers/on-temp-company-created";
import { CreateTempCompanyUseCase } from "@/domain/user/application/use-cases/create-temp-company";
import { LinkBuilderInterface } from "@/domain/notification/application/interfaces/link-builder-interface";
import { LinkBuilder } from "../notification/link/link-builder";

container.registerInstance<PrismaClient>("PrismaClient", new PrismaClient());

//Use-cases
container.registerSingleton<CreateTempCompanyUseCase>(
  "CreateTempCompanyUseCase",
  CreateTempCompanyUseCase
);

//Repositories
container.registerSingleton<TempCompaniesRepositoryInterface>(
  "TempCompaniesRepository",
  PrismaTempCompaniesRepository
);
container.registerSingleton<CompaniesRepositoryInterface>(
  "CompaniesRepository",
  PrismaCompaniesRepository
);
container.registerSingleton<UsersRepositoryInterface>(
  "UsersRepository",
  PrismaUsersRepository
);
container.registerSingleton<EmailsRepositoryInterface>(
  "EmailsRepository",
  PrismaEmailsRepository
);

// Shared
container.registerSingleton<HashGeneratorInterface>(
  "HashGenerator",
  HashGeneratorHandler
);

// Notification
container.registerSingleton<EmailSenderInterface>(
  "EmailSender",
  ResendEmailService
);
container.registerSingleton<SendEmailUseCase>(
  "SendEmailUseCase",
  SendEmailUseCase
);
container.registerSingleton<OnTempCompanyCreated>(
  "OnTempCompanyCreated",
  OnTempCompanyCreated
);
container.registerSingleton<LinkBuilderInterface>("LinkBuilder", LinkBuilder);

//Dispatch
container.resolve(OnTempCompanyCreated);

export { container };
