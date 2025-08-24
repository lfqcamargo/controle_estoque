import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import z from 'zod';

import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user';
import { WrongCredentialsError } from '@/domain/user/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const authenticateUserBodySchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5)
    .max(255)
    .transform(email => email.toLowerCase().trim()),
  password: z.string().min(6).max(100),
});

type AuthenticateUserBody = z.infer<typeof authenticateUserBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(authenticateUserBodySchema);

@Controller('/auth')
@Public()
export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body(bodyValidationPipe) body: AuthenticateUserBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new UnauthorizedException(error.message);
      }
    }

    const { accessToken } = result.value;

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      message: 'Logged in',
    };
  }
}
