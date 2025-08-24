import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import z from 'zod';

import { GenerateNewPasswordTokenUseCase } from '@/domain/user/application/use-cases/generate-new-password-token';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const generateNewPasswordTokenParamsSchema = z.object({
  email: z.email().transform(email => email.toLowerCase().trim()),
});

type GenerateNewPasswordTokenParams = z.infer<
  typeof generateNewPasswordTokenParamsSchema
>;
const paramsValidationPipe = new ZodValidationPipe(
  generateNewPasswordTokenParamsSchema,
);

@Controller('users/forgot-password/:email')
@Public()
export class GenerateNewPasswordTokenController {
  constructor(
    private generateNewPasswordTokenUseCase: GenerateNewPasswordTokenUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async create(
    @Param(paramsValidationPipe) params: GenerateNewPasswordTokenParams,
  ) {
    const { email } = params;

    await this.generateNewPasswordTokenUseCase.execute({
      email,
    });
  }
}
