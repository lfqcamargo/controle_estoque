import { Module } from '@nestjs/common';

import { EmailsRepositoryInterface } from '@/domain/notification/application/interfaces/emails-repository-interface';
import { CompaniesRepositoryInterface } from '@/domain/user/application/interfaces/companies-repository-interface';
import { TempCompaniesRepositoryInterface } from '@/domain/user/application/interfaces/temp-companies-repository-interface';
import { UsersRepositoryInterface } from '@/domain/user/application/interfaces/users-repository-interface';

import { PasswordTokensRepositoryInterface } from '../../domain/user/application/interfaces/password-tokens-repository-interface';
import { PrismaService } from './prisma/prisma.service';
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository';
import { PrismaEmailsRepository } from './prisma/repositories/prisma-emails-repository';
import { PrismaPasswordTokensRepository } from './prisma/repositories/prisma-password-token-repository';
import { PrismaTempCompaniesRepository } from './prisma/repositories/prisma-temp-companies-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';

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
    {
      provide: PasswordTokensRepositoryInterface,
      useClass: PrismaPasswordTokensRepository,
    },
  ],
  exports: [
    PrismaService,
    TempCompaniesRepositoryInterface,
    CompaniesRepositoryInterface,
    UsersRepositoryInterface,
    EmailsRepositoryInterface,
    PasswordTokensRepositoryInterface,
  ],
})
export class DatabaseModule {}
