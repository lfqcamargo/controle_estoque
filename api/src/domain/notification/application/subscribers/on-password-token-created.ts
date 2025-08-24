import { Injectable } from '@nestjs/common';

import { DomainEvents } from '@/core/events/domain-events';
import { UsersRepositoryInterface } from '@/domain/user/application/interfaces/users-repository-interface';
import { PasswordTokenCreatedEvent } from '@/domain/user/enterprise/events/password-token-created.event';

import { SendEmailUseCase } from '../use-cases/send-email';

@Injectable()
export class OnPasswordTokenCreated {
  constructor(
    private sendEmail: SendEmailUseCase,
    private usersRepository: UsersRepositoryInterface,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPasswordResetEmail.bind(this),
      PasswordTokenCreatedEvent.name,
    );
  }

  private async sendPasswordResetEmail(event: unknown) {
    const passwordTokenCreatedEvent = event as PasswordTokenCreatedEvent;
    const { passwordToken, userId } = passwordTokenCreatedEvent;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.sendEmail.execute({
      to: user.email,
      subject: 'Recuperação de Senha',
      body: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Olá <strong>${user.name}</strong>,</p>
    
        <p>Você solicitou a recuperação de senha da sua conta.</p>
    
        <p>Para criar uma nova senha, utilize o token abaixo:</p>
    
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; font-size: 16px; font-weight: bold; color: #2c3e50;">
          http://localhost:5173/auth/reset-password?token=${passwordToken.token}
        </pre>
    
        <p><strong>Validade do token:</strong><br />
        ${passwordToken.expiration.toLocaleString('pt-BR', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}</p>
    
        <p style="color: #666;">Se você não solicitou essa recuperação de senha, apenas ignore este e-mail. Nenhuma ação será tomada.</p>
    
        <p>Atenciosamente,<br />
        <strong>Equipe de Controle de Vendas</strong></p>
      </div>
    `,
    });
  }
}
