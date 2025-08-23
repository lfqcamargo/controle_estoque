import "reflect-metadata";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfirmationCreateCompanyUseCase } from "./confirmation-create-company";
import { makeTempCompany } from "test/factories/make-temp-company";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";
import { DomainEvents } from "@/core/events/domain-events";
import { TokenExpiratedError } from "./errors/token-expirated-error";
import { makeUser } from "test/factories/make-user";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { makeCompany } from "test/factories/make-company";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";

let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ConfirmationCreateCompanyUseCase;

describe("Confirmation create company use case", () => {
  beforeEach(() => {
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository();

    sut = new ConfirmationCreateCompanyUseCase(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository,
      inMemoryCompaniesRepository
    );
  });

  it("should be able to confirm create company", async () => {
    DomainEvents.shouldRun = true;
    const userTemp = makeTempCompany({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "Test User",
      password: "123456",
    });

    await inMemoryTempCompaniesRepository.create(userTemp);

    const result = await sut.execute({ token: userTemp.token });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCompaniesRepository.items[0]!.cnpj).toEqual(userTemp.cnpj);
    expect(inMemoryCompaniesRepository.items[0]!.name).toEqual(
      userTemp.companyName
    );
  });

  it("should not be able to confirm create company with invalid token", async () => {
    const result = await sut.execute({ token: "invalid-token" });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceTokenNotFoundError);
  });

  it("should not be able to confirm create company with expired token", async () => {
    const userTemp = makeTempCompany({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "Test User",
      password: "123456",
      expiration: new Date(Date.now() - 1000),
    });

    await inMemoryTempCompaniesRepository.create(userTemp);

    const result = await sut.execute({ token: userTemp.token });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(TokenExpiratedError);
  });

  it("should not be able to confirm create company with already existing email", async () => {
    const existingEmail = "test@test.com";
    await inMemoryUsersRepository.create(makeUser({ email: "test@test.com" }));

    const userTemp = makeTempCompany({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: existingEmail,
      userName: "Test User",
      password: "123456",
    });

    await inMemoryTempCompaniesRepository.create(userTemp);

    const result = await sut.execute({ token: userTemp.token });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsEmailError);
  });

  it("should not be able to confirm create company with already existing cnpj", async () => {
    const cnpj = "123456789";
    await inMemoryCompaniesRepository.create(
      makeCompany({ cnpj: "123456789" })
    );

    const userTemp = makeTempCompany({
      cnpj: cnpj,
      companyName: "Test Company",
      email: "teste@gmail.com",
      userName: "Test User",
      password: "123456",
    });

    await inMemoryTempCompaniesRepository.create(userTemp);

    const result = await sut.execute({ token: userTemp.token });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsCnpjError);
  });
});
