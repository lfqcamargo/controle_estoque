import { Module } from '@nestjs/common';

import { EmailSenderInterface } from '@/domain/notification/application/interfaces/email-sender-interface';

import { ResendEmailService } from './resend-email.service';

@Module({
  providers: [
    {
      provide: EmailSenderInterface,
      useClass: ResendEmailService,
    },
  ],
  exports: [EmailSenderInterface],
})
export class EmailModule {}
