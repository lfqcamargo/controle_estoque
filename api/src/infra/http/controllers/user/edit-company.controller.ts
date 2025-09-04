import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import z from 'zod';

import { EditCompanyUseCase } from '@/domain/user/application/use-cases/edit-company';
import { CompanyNotFoundError } from '@/domain/user/application/use-cases/errors/company-not-found-error';
import { UserNotAdminError } from '@/domain/user/application/use-cases/errors/user-not-admin-error';
import { UserNotFoundError } from '@/domain/user/application/use-cases/errors/user-not-found-error';
import { UserRole } from '@/domain/user/enterprise/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Roles } from '@/infra/auth/roles.decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const editCompanyBodySchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .transform(s => s.trim()),
});

type EditCompanyBody = z.infer<typeof editCompanyBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(editCompanyBodySchema);

@Controller('companies')
export class EditCompanyController {
  constructor(private editCompanyUseCase: EditCompanyUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Body(bodyValidationPipe) body: EditCompanyBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { userId } = user;

    const { name } = body;

    const result = await this.editCompanyUseCase.execute({
      authenticateUserId: userId,
      name: name,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotAdminError) {
        throw new ForbiddenException(error.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
