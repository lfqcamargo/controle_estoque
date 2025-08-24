import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { HashGeneratorInterface } from '../../../shared/cryptography/interfaces/hash-generator-interface';
import { PasswordToken } from '../../enterprise/entities/password-token';
import { PasswordTokensRepositoryInterface } from '../interfaces/password-tokens-repository-interface';
import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { UserNotFoundError } from './errors/user-not-found-error';

interface GenerateNewPasswordTokenUseCaseRequest {
  email: string;
}

interface GenerateNewPasswordTokenUseCaseResponse {
  token: string;
  expiration: Date;
}

type GenerateNewPasswordTokenUseCaseResult = Either<
  UserNotFoundError,
  GenerateNewPasswordTokenUseCaseResponse
>;

@Injectable()
export class GenerateNewPasswordTokenUseCase {
  constructor(
    private usersRepository: UsersRepositoryInterface,
    private passwordTokensRepository: PasswordTokensRepositoryInterface,
    private hashGenerator: HashGeneratorInterface,
  ) {}

  async execute({
    email,
  }: GenerateNewPasswordTokenUseCaseRequest): Promise<GenerateNewPasswordTokenUseCaseResult> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return left(new UserNotFoundError());

    const token = await this.hashGenerator.hash(
      new UniqueEntityID().toString(),
    );
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const passwordToken = PasswordToken.create({
      token,
      expiration,
      userId: user.id,
    });

    await this.passwordTokensRepository.create(passwordToken);

    return right({
      token,
      expiration,
    });
  }
}
