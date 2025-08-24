import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { EmailModule } from '@/infra/event/email/email.module';
import { LinkModule } from '@/infra/link/link.module';

import { OnPasswordTokenCreated } from '../../domain/notification/application/subscribers/on-password-token-created';
import { OnTempCompanyCreated } from '../../domain/notification/application/subscribers/on-temp-company-created';
import { SendEmailUseCase } from '../../domain/notification/application/use-cases/send-email';

@Module({
  imports: [DatabaseModule, EmailModule, LinkModule],
  providers: [SendEmailUseCase, OnTempCompanyCreated, OnPasswordTokenCreated],
  exports: [OnTempCompanyCreated, OnPasswordTokenCreated],
})
export class EventModule {}
