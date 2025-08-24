import { Either } from '@/core/either';

import { Email } from '../../enterprise/entities/email';

export interface SendEmailResponse {
  success: boolean;
  error?: string;
}

export abstract class EmailSenderInterface {
  abstract sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>>;
}
