import { makeCompany } from 'test/factories/make-company';
import { makeUser } from 'test/factories/make-user';
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { UserRole } from '../../enterprise/entities/user';
import { EditCompanyUseCase } from './edit-company';
import { CompanyNotFoundError } from './errors/company-not-found-error';
import { UserNotAdminError } from './errors/user-not-admin-error';
import { UserNotFoundError } from './errors/user-not-found-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let sut: EditCompanyUseCase;

describe('Edit company', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository();

    sut = new EditCompanyUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to edit the company', async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user = makeUser({ companyId: company.id });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      authenticateUserId: user.id.toString(),
      name: 'New name',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const updated = result.value.company;
      expect(updated.name).toBe('New name');
    }
  });

  it('should not be able to edit the company if the user does not exist', async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const result = await sut.execute({
      authenticateUserId: 'non-existent-user-id',
      name: 'New name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should not be able to edit the company if the company does not exist', async () => {
    const user = makeUser({ companyId: new UniqueEntityID('company-id') });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      authenticateUserId: user.id.toString(),
      name: 'New name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it('should not be able to edit the company if user is not admin', async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user = makeUser({
      companyId: company.id,
      role: UserRole.EMPLOYEE,
    });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      authenticateUserId: user.id.toString(),
      name: 'New name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });
});
