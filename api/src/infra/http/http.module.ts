import { Module } from '@nestjs/common';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { EmailModule } from '../event/email/email.module';
import { EventModule } from '@/infra/event/event.module';
import { UserModule } from './controllers/user/user.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    UserModule,
    EmailModule,
    EventModule,
  ],
})
export class HttpModule {}
