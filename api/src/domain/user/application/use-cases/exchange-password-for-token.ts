import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { HashGeneratorInterface } from '../../../shared/cryptography/interfaces/hash-generator-interface';
import { User } from '../../enterprise/entities/user';
import { PasswordTokensRepositoryInterface } from '../interfaces/password-tokens-repository-interface';
import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { ResourceTokenNotFoundError } from './errors/resource-token-not-found-error';
import { TokenExpiratedError } from './errors/token-expirated-error';
import { UserNotFoundError } from './errors/user-not-found-error';

interface ExchangePasswordForTokenUseCaseRequest {
  token: string;
  password: string;
}

type ExchangePasswordForTokenUseCaseResult = Either<
  ResourceTokenNotFoundError | UserNotFoundError | TokenExpiratedError,
  {
    user: User;
  }
>;

@Injectable()
export class ExchangePasswordForTokenUseCase {
  constructor(
    private usersRepository: UsersRepositoryInterface,
    private passwordTokensRepository: PasswordTokensRepositoryInterface,
    private hashGenerator: HashGeneratorInterface,
  ) {}

  async execute({
    token,
    password,
  }: ExchangePasswordForTokenUseCaseRequest): Promise<ExchangePasswordForTokenUseCaseResult> {
    const passwordToken = await this.passwordTokensRepository.findByToken(
      token,
    );
    if (!passwordToken) return left(new ResourceTokenNotFoundError());

    const user = await this.usersRepository.findById(
      passwordToken.userId.toString(),
    );
    if (!user) return left(new UserNotFoundError());

    if (passwordToken.expiration < new Date())
      return left(new TokenExpiratedError());

    const passwordHash = await this.hashGenerator.hash(password);

    user.password = passwordHash;

    await this.usersRepository.update(user);

    return right({
      user: user,
    });
  }
}
