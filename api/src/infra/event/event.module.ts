import { Module } from '@nestjs/common';
import { OnTempCompanyCreated } from '../../domain/notification/application/subscribers/on-temp-company-created';
import { SendEmailUseCase } from '../../domain/notification/application/use-cases/send-email';
import { EmailModule } from '@/infra/event/email/email.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { TempCompaniesRepositoryInterface } from '@/domain/user/application/interfaces/temp-companies-repository-interface';
import { PrismaTempCompaniesRepository } from '../database/prisma/repositories/prisma-temp-companies-repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
  // imports: [DatabaseModule, EmailModule],
  // providers: [
  //   SendEmailUseCase,
  //   OnTempCompanyCreated,
  // ],
  // exports: [OnTempCompanyCreated],
})
export class EventModule {}
