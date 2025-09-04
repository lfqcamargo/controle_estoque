import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { Company } from '@/domain/user/enterprise/entities/company';

import { UserRole } from '../../enterprise/entities/user';
import { CompaniesRepositoryInterface } from '../interfaces/companies-repository-interface';
import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { CompanyNotFoundError } from './errors/company-not-found-error';
import { UserNotAdminError } from './errors/user-not-admin-error';
import { UserNotFoundError } from './errors/user-not-found-error';

type EditCompanyUseCaseRequest = {
  authenticateUserId: string;
  name: string;
};

type EditCompanyUseCaseResponse = Either<
  CompanyNotFoundError | UserNotFoundError | UserNotAdminError,
  {
    company: Company;
  }
>;

@Injectable()
export class EditCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepositoryInterface,
    private usersRepository: UsersRepositoryInterface,
  ) {}

  async execute({
    authenticateUserId,
    name,
  }: EditCompanyUseCaseRequest): Promise<EditCompanyUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateUserId);
    if (!user) return left(new UserNotFoundError());

    if (user.role !== UserRole.ADMIN) return left(new UserNotAdminError());

    const company = await this.companiesRepository.findById(
      user.companyId.toString(),
    );
    if (!company) return left(new CompanyNotFoundError());

    company.name = name;
    await this.companiesRepository.save(company);

    return right({ company });
  }
}
