import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Company } from '../../enterprise/entities/company';
import { User, UserRole } from '../../enterprise/entities/user';
import { CompaniesRepositoryInterface } from '../interfaces/companies-repository-interface';
import { TempCompaniesRepositoryInterface } from '../interfaces/temp-companies-repository-interface';
import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error';
import { AlreadyExistsEmailError } from './errors/already-exists-email-error';
import { ResourceTokenNotFoundError } from './errors/resource-token-not-found-error';
import { TokenExpiratedError } from './errors/token-expirated-error';

interface ConfirmationCreateCompanyUseCaseRequest {
  token: string;
}

type ConfirmationCreateCompanyUseCaseResponse = Either<
  | ResourceTokenNotFoundError
  | AlreadyExistsCnpjError
  | AlreadyExistsEmailError
  | TokenExpiratedError,
  {
    user: User;
  }
>;

@Injectable()
export class ConfirmationCreateCompanyUseCase {
  constructor(
    private tempCompaniesRepository: TempCompaniesRepositoryInterface,
    private usersRepository: UsersRepositoryInterface,
    private companiesRepository: CompaniesRepositoryInterface,
  ) {}

  async execute({
    token,
  }: ConfirmationCreateCompanyUseCaseRequest): Promise<ConfirmationCreateCompanyUseCaseResponse> {
    const tempCompany = await this.tempCompaniesRepository.findByToken(token);
    if (!tempCompany) return left(new ResourceTokenNotFoundError());

    const alreadyExistsCompany = await this.companiesRepository.findByCnpj(
      tempCompany.cnpj,
    );
    if (alreadyExistsCompany) return left(new AlreadyExistsCnpjError());

    const alreadyExistsEmail = await this.usersRepository.findByEmail(
      tempCompany.email,
    );
    if (alreadyExistsEmail) return left(new AlreadyExistsEmailError());

    if (tempCompany.expiration < new Date()) {
      return left(new TokenExpiratedError());
    }

    const company = Company.create({
      cnpj: tempCompany.cnpj,
      name: tempCompany.companyName,
    });

    const user = User.create({
      email: tempCompany.email,
      name: tempCompany.userName,
      password: tempCompany.password,
      role: UserRole.ADMIN,
      companyId: company.id,
      active: true,
    });

    company.users.push(user);

    await this.companiesRepository.create(company);

    return right({ user });
  }
}
