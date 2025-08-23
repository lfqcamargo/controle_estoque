import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EventModule } from '@/infra/event/event.module';
import { Module } from '@nestjs/common';
import { CreateTempCompanyController } from './create-temp-company.controller';
import { CreateTempCompanyUseCase } from '@/domain/user/application/use-cases/create-temp-company';
import { ConfirmationCreateCompanyController } from './confirmation-create-company.controller';
import { ConfirmationCreateCompanyUseCase } from '@/domain/user/application/use-cases/confirmation-create-company';

@Module({
  imports: [DatabaseModule, CryptographyModule, EventModule],
  controllers: [
    CreateTempCompanyController,
    ConfirmationCreateCompanyController,
  ],
  providers: [CreateTempCompanyUseCase, ConfirmationCreateCompanyUseCase],
})
export class UserModule {}
