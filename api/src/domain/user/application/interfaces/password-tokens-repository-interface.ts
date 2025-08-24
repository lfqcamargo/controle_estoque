import { PasswordToken } from '../../enterprise/entities/password-token';

export abstract class PasswordTokensRepositoryInterface {
  abstract create(data: PasswordToken): Promise<void>;
  abstract findByToken(token: string): Promise<PasswordToken | null>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
