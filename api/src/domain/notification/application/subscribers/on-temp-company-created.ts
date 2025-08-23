import { DomainEvents } from '@/core/events/domain-events';
import { TempCompanyCreatedEvent } from '@/domain/user/enterprise/events/temp-company-created.event';
import { SendEmailUseCase } from '../use-cases/send-email';
import { LinkBuilderInterface } from '../interfaces/link-builder-interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnTempCompanyCreated {
  constructor(
    private sendEmail: SendEmailUseCase,
    private linkBuilder: LinkBuilderInterface,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event: unknown) => this.sendWelcomeEmail(event),
      TempCompanyCreatedEvent.name,
    );
  }

  private async sendWelcomeEmail(event: unknown) {
    const tempCompanyCreatedEvent = event as TempCompanyCreatedEvent;
    const { tempCompany } = tempCompanyCreatedEvent;

    const confirmationLink = `${this.linkBuilder.url()}/auth/confirmation-email-company?token=${
      tempCompany.token
    }`;

    await this.sendEmail.execute({
      to: tempCompany.email,
      subject: '🎉 Bem-vindo à plataforma StockManagers!',
      body: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
          <p>Olá <strong>${tempCompany.userName}</strong>,</p>

          <p>Seja bem-vindo à <strong>StockManagers</strong>! Seu cadastro temporário foi realizado com sucesso.</p>

          <p>Para concluir seu cadastro e acessar a plataforma, clique no link abaixo:</p>

          <p>
            <a href="${confirmationLink}" 
               style="display: inline-block; padding: 12px 20px; background-color: #2c3e50; color: #fff; text-decoration: none; border-radius: 4px;">
              Confirmar Cadastro
            </a>
          </p>
          <p>${confirmationLink}</p>

          <p><strong>Validade do link:</strong><br />
          ${tempCompany.expiration.toLocaleString('pt-BR', {
            dateStyle: 'full',
            timeStyle: 'short',
          })}</p>

          <p>Se você não solicitou este cadastro, pode ignorar este e-mail.</p>

          <p>Atenciosamente,<br />
          <strong>Equipe StockManagers</strong></p>
        </div>
      `,
    });
  }
}
