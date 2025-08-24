import { Module } from '@nestjs/common';

import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user';
import { ConfirmationCreateCompanyUseCase } from '@/domain/user/application/use-cases/confirmation-create-company';
import { CreateTempCompanyUseCase } from '@/domain/user/application/use-cases/create-temp-company';
import { GenerateNewPasswordTokenUseCase } from '@/domain/user/application/use-cases/generate-new-password-token';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EventModule } from '@/infra/event/event.module';

import { ExchangePasswordForTokenUseCase } from '../../../../domain/user/application/use-cases/exchange-password-for-token';
import { AuthenticateUserController } from './authenticate-user.controller';
import { ConfirmationCreateCompanyController } from './confirmation-create-company.controller';
import { CreateTempCompanyController } from './create-temp-company.controller';
import { ExchangePasswordForTokenController } from './exchange-password-for-token.controller';
import { GenerateNewPasswordTokenController } from './generate-new-password-token.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, EventModule],
  controllers: [
    CreateTempCompanyController,
    ConfirmationCreateCompanyController,
    AuthenticateUserController,
    GenerateNewPasswordTokenController,
    ExchangePasswordForTokenController,
  ],
  providers: [
    CreateTempCompanyUseCase,
    ConfirmationCreateCompanyUseCase,
    AuthenticateUserUseCase,
    GenerateNewPasswordTokenUseCase,
    ExchangePasswordForTokenUseCase,
  ],
})
export class UserModule {}
