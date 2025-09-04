import { Module } from '@nestjs/common';

import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user';
import { ConfirmationCreateCompanyUseCase } from '@/domain/user/application/use-cases/confirmation-create-company';
import { CreateTempCompanyUseCase } from '@/domain/user/application/use-cases/create-temp-company';
import { EditCompanyUseCase } from '@/domain/user/application/use-cases/edit-company';
import { ExchangePasswordForTokenUseCase } from '@/domain/user/application/use-cases/exchange-password-for-token';
import { GenerateNewPasswordTokenUseCase } from '@/domain/user/application/use-cases/generate-new-password-token';
import { GetProfileCompanyUseCase } from '@/domain/user/application/use-cases/get-profile-company';
import { GetProfileUserUseCase } from '@/domain/user/application/use-cases/get-profile-user';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EventModule } from '@/infra/event/event.module';

import { AuthenticateUserController } from './authenticate-user.controller';
import { ConfirmationCreateCompanyController } from './confirmation-create-company.controller';
import { CreateTempCompanyController } from './create-temp-company.controller';
import { EditCompanyController } from './edit-company.controller';
import { ExchangePasswordForTokenController } from './exchange-password-for-token.controller';
import { GenerateNewPasswordTokenController } from './generate-new-password-token.controller';
import { GetProfileCompanyController } from './get-profile-company.controller';
import { GetProfileUserController } from './get-profile-user.controller';
import { LogoutController } from './logout.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, EventModule],
  controllers: [
    CreateTempCompanyController,
    ConfirmationCreateCompanyController,
    AuthenticateUserController,
    GenerateNewPasswordTokenController,
    ExchangePasswordForTokenController,
    LogoutController,
    GetProfileCompanyController,
    GetProfileUserController,
    EditCompanyController,
  ],
  providers: [
    CreateTempCompanyUseCase,
    ConfirmationCreateCompanyUseCase,
    AuthenticateUserUseCase,
    GenerateNewPasswordTokenUseCase,
    ExchangePasswordForTokenUseCase,
    GetProfileCompanyUseCase,
    GetProfileUserUseCase,
    EditCompanyUseCase,
  ],
})
export class UserModule {}
