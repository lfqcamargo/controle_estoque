import { Module } from '@nestjs/common';

import { EventModule } from '@/infra/event/event.module';

import { AuthModule } from '../auth/auth.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../event/email/email.module';
import { UserModule } from './controllers/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    AuthModule,
    UserModule,
    EmailModule,
    EventModule,
  ],
})
export class HttpModule {}
