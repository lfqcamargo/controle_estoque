import z from 'zod';
import { ConfirmationCreateCompanyUseCase } from '@/domain/user/application/use-cases/confirmation-create-company';
import { ResourceTokenNotFoundError } from '@/domain/user/application/use-cases/errors/resource-token-not-found-error';
import { AlreadyExistsCnpjError } from '@/domain/user/application/use-cases/errors/already-exists-cnpj-error';
import { AlreadyExistsEmailError } from '@/domain/user/application/use-cases/errors/already-exists-email-error';
import { TokenExpiratedError } from '@/domain/user/application/use-cases/errors/token-expirated-error';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const confirmationCreateCompanyParamsSchema = z.object({
  token: z.string(),
});

type ConfirmationCreateCompanyParams = z.infer<
  typeof confirmationCreateCompanyParamsSchema
>;
const paramsValidationPipe = new ZodValidationPipe(
  confirmationCreateCompanyParamsSchema,
);

@Public()
@Controller('/companies/token/:token')
export class ConfirmationCreateCompanyController {
  constructor(
    private confirmationCreateCompanyUseCase: ConfirmationCreateCompanyUseCase,
  ) {}

  @Get()
  @HttpCode(201)
  async handle(
    @Param(paramsValidationPipe) params: ConfirmationCreateCompanyParams,
  ) {
    const { token } = params;

    const result = await this.confirmationCreateCompanyUseCase.execute({
      token,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceTokenNotFoundError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof AlreadyExistsCnpjError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof AlreadyExistsEmailError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof TokenExpiratedError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException();
    }

    return {
      email: result.value.user.email,
    };
  }
}
