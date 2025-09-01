import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { User } from '../../enterprise/entities/user';
import { UsersRepositoryInterface } from '../interfaces/users-repository-interface';
import { UserNotFoundError } from './errors/user-not-found-error';

interface GetProfileUserUseCaseRequest {
  userAuthenticateId: string;
}
type GetProfileUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class GetProfileUserUseCase {
  constructor(private usersRepository: UsersRepositoryInterface) {}

  async execute({
    userAuthenticateId,
  }: GetProfileUserUseCaseRequest): Promise<GetProfileUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userAuthenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    user.password = '';

    return right({
      user,
    });
  }
}
