import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaEmailsRepository } from './prisma/repositories/prisma-emails-repository';
import { CompaniesRepositoryInterface } from '@/domain/user/application/interfaces/companies-repository-interface';
import { UsersRepositoryInterface } from '@/domain/user/application/interfaces/users-repository-interface';
import { EmailsRepositoryInterface } from '@/domain/notification/application/interfaces/emails-repository-interface';
import { TempCompaniesRepositoryInterface } from '@/domain/user/application/interfaces/temp-companies-repository-interface';
import { PrismaTempCompaniesRepository } from './prisma/repositories/prisma-temp-companies-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: TempCompaniesRepositoryInterface,
      useClass: PrismaTempCompaniesRepository,
    },
    {
      provide: CompaniesRepositoryInterface,
      useClass: PrismaCompaniesRepository,
    },
    { provide: UsersRepositoryInterface, useClass: PrismaUsersRepository },
    { provide: EmailsRepositoryInterface, useClass: PrismaEmailsRepository },
  ],
  exports: [
    PrismaService,
    TempCompaniesRepositoryInterface,
    CompaniesRepositoryInterface,
    UsersRepositoryInterface,
    EmailsRepositoryInterface,
  ],
})
export class DatabaseModule {}
