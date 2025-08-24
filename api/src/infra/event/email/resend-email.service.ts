import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { Either, left,right } from '@/core/either';
import { EmailSenderInterface } from '@/domain/notification/application/interfaces/email-sender-interface';
import { SendEmailResponse } from '@/domain/notification/application/interfaces/email-sender-interface';
import { Email } from '@/domain/notification/enterprise/entities/email';

@Injectable()
export class ResendEmailService implements EmailSenderInterface {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    try {
      const { error } = await this.resend.emails.send({
        from: email.from ?? 'Sistema <noreply@resend.dev>',
        to: email.to,
        subject: email.subject,
        html: email.body,
      });

      if (error) {
        console.error('❌ Erro Resend:', error);
        return left(new Error('Erro ao enviar e-mail com Resend'));
      }

      console.log('📧 Email enviado com sucesso via Resend!');
      return right({ success: true });
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      return left(new Error('Falha ao enviar e-mail com Resend'));
    }
  }
}
