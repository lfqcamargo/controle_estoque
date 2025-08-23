import { Email } from '../../enterprise/entities/email';

export abstract class EmailsRepositoryInterface {
  abstract create(email: Email): Promise<void>;
  abstract findById(id: string): Promise<Email | null>;
  abstract save(email: Email): Promise<void>;
}
