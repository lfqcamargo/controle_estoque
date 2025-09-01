import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Company } from '../../enterprise/entities/company';
import { CompaniesRepositoryInterface } from '../interfaces/companies-repository-interface';
import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { CompanyNotFoundError } from './errors/company-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';

interface GetProfileCompanyUseCaseRequest {
  userAuthenticateId: string;
}

type GetProfileCompanyUseCaseResponse = Either<
  UserNotFoundError | CompanyNotFoundError,
  {
    company: Company;
  }
>;

@Injectable()
export class GetProfileCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepositoryInterface,
    private usersRepository: UsersRepositoryInterface,
  ) {}

  async execute({
    userAuthenticateId,
  }: GetProfileCompanyUseCaseRequest): Promise<GetProfileCompanyUseCaseResponse> {
    const userAuthenticate = await this.usersRepository.findById(
      userAuthenticateId,
    );
    if (!userAuthenticate) return left(new UserNotFoundError());

    const company = await this.companiesRepository.findById(
      userAuthenticate.companyId.toString(),
    );
    if (!company) return left(new CompanyNotFoundError());

    return right({
      company,
    });
  }
}
