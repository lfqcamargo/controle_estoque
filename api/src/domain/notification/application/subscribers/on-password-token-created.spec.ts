import { makePasswordToken } from 'test/factories/make-password-token';
import { makeUser } from 'test/factories/make-user';
import { InMemoryEmailsRepository } from 'test/repositories/in-memory-emails-repository';
import { InMemoryPasswordTokensRepository } from 'test/repositories/in-memory-password-tokens-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeEmailSender } from 'test/services/fake-email-sender';
import { beforeEach, describe, expect, it } from 'vitest';

import { DomainEvents } from '@/core/events/domain-events';

import { SendEmailUseCase } from '../use-cases/send-email';
import { OnPasswordTokenCreated } from './on-password-token-created';

let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let sendEmail: SendEmailUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPasswordTokensRepository: InMemoryPasswordTokensRepository;

describe('On Password Token Created', () => {
  beforeEach(() => {
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryPasswordTokensRepository = new InMemoryPasswordTokensRepository();
    DomainEvents.clearHandlers();
  });

  it('should send a password reset email when password token is created', async () => {
    new OnPasswordTokenCreated(sendEmail, inMemoryUsersRepository);

    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const passwordToken = makePasswordToken({
      userId: user.id,
    });

    await inMemoryPasswordTokensRepository.create(passwordToken);

    DomainEvents.dispatchEventsForAggregate(passwordToken.id);

    const sentEmail = fakeEmailSender.sentEmails[0]!;

    expect(sentEmail).toBeDefined();
    expect(sentEmail.to).toBe(user.email);
    expect(sentEmail.subject).toBe('Recuperação de Senha');
    expect(sentEmail.body).toContain(user.name);
    expect(sentEmail.body).toContain(passwordToken.token);
  });
});
