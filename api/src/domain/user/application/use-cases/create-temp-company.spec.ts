import "reflect-metadata";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateTempCompanyUseCase } from "./create-temp-company";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { DomainEvents } from "@/core/events/domain-events";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { makeTempCompany } from "test/factories/make-temp-company";

let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let hashGenerator: FakeHasher;
let createTempCompany: CreateTempCompanyUseCase;

describe("Create temp user use case", () => {
  beforeEach(() => {
    DomainEvents.clearHandlers();

    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    hashGenerator = new FakeHasher();

    createTempCompany = new CreateTempCompanyUseCase(
      inMemoryTempCompaniesRepository,
      inMemoryCompaniesRepository,
      inMemoryUsersRepository,
      hashGenerator
    );
  });

  it("should be able to create a temp user and send welcome email", async () => {
    const result = await createTempCompany.execute({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "test",
      password: "test",
    });

    expect(result.isRight()).toBe(true);

    const tempUser = inMemoryTempCompaniesRepository.items[0];
    expect(tempUser).toBeDefined();

    if (tempUser) {
      expect(tempUser.id).toBeDefined();
      expect(tempUser.cnpj).toBe("12345678901234");
      expect(tempUser.companyName).toBe("Test Company");
      expect(tempUser.email).toBe("test@test.com");
      expect(tempUser.userName).toBe("test");
      expect(tempUser.password).toBe("test-hashed");
      expect(tempUser.expiration).toBeDefined();
    }
  });

  it("should not be able to create a temp user with an already existing cnpj", async () => {
    const company = makeCompany({ cnpj: "12345678901234" });
    await inMemoryCompaniesRepository.create(company);

    const result = await createTempCompany.execute({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "test",
      password: "test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsCnpjError);
  });

  it("should not be able to create a temp user with an already existing email", async () => {
    await inMemoryUsersRepository.create(makeUser({ email: "test@test.com" }));

    const result = await createTempCompany.execute({
      cnpj: "12345678901235",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "test",
      password: "test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsEmailError);
  });

  it("should generate a new token if a previous temp company with same email or cnpj exists", async () => {
    const oldToken = makeTempCompany({
      cnpj: "12345678901234",
      token: "old-token",
    });
    await inMemoryTempCompaniesRepository.create(oldToken);

    const result = await createTempCompany.execute({
      cnpj: "12345678901234",
      companyName: "New Company",
      email: "test@test.com",
      userName: "newuser",
      password: "newpass",
    });

    expect(result.isRight()).toBe(true);
    const tempCompany = inMemoryTempCompaniesRepository.items[0];
    expect(tempCompany).toBeDefined();

    if (tempCompany) {
      expect(tempCompany.companyName).toBe("New Company");
      expect(tempCompany.userName).toBe("newuser");
      expect(tempCompany.token).not.toBe("old-token");
      expect(tempCompany.password).toBe("newpass-hashed");
    }
  });
});
