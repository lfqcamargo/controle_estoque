import "reflect-metadata";
import { container } from "tsyringe";
import { InMemoryTempCompaniesRepository } from "../repositories/in-memory-temp-companies-repository";
import { InMemoryCompaniesRepository } from "../repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";
import { InMemoryEmailsRepository } from "../repositories/in-memory-emails-repository";
import { FakeHasher } from "../cryptography/fake-hasher";
import { FakeEmailSender } from "../notification/fake-email-sender";
import { TempCompaniesRepository } from "@/domain/user/application/repositories/temp-companies-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { EmailsRepository } from "@/domain/notification/application/repositories/emails-repository";
import { HashGenerator } from "@/domain/shared/cryptography/hash-generator";
import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { SendEmailUseCase } from "@/domain/notification/application/use-cases/send-email";
import { OnTempCompanyCreated } from "@/domain/notification/application/subscribers/on-temp-company-created";

// Registra os repositórios in-memory para testes
container.registerSingleton<TempCompaniesRepository>(
  "TempCompaniesRepository",
  InMemoryTempCompaniesRepository
);

container.registerSingleton<CompaniesRepository>(
  "CompaniesRepository",
  InMemoryCompaniesRepository
);

container.registerSingleton<UsersRepository>(
  "UsersRepository",
  InMemoryUsersRepository
);

container.registerSingleton<EmailsRepository>(
  "EmailsRepository",
  InMemoryEmailsRepository
);

// Registra o FakeHasher para testes
container.registerSingleton<HashGenerator>("HashGenerator", FakeHasher);

// Registra o FakeEmailSender para testes
container.registerSingleton<EmailSender>("EmailSender", FakeEmailSender);

// Registra o SendEmailUseCase
container.registerSingleton<SendEmailUseCase>(
  "SendEmailUseCase",
  SendEmailUseCase
);

// Registra o subscriber
container.registerSingleton<OnTempCompanyCreated>(
  "OnTempCompanyCreated",
  OnTempCompanyCreated
);

export { container }; 