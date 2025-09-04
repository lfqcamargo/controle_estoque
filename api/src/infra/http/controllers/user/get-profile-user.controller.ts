import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UserNotFoundError } from '@/domain/user/application/use-cases/errors/user-not-found-error';
import { GetProfileUserUseCase } from '@/domain/user/application/use-cases/get-profile-user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { UserPresenter } from '@/infra/http/presenters/user-presenter';

@Controller('users/me')
export class GetProfileUserController {
  constructor(private getProfileUserUseCase: GetProfileUserUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const { userId: userAuthenticateId } = user;

    const result = await this.getProfileUserUseCase.execute({
      userAuthenticateId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException();
    }

    return UserPresenter.toHTTP(result.value.user);
  }
}
