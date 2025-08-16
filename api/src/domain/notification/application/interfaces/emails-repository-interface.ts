import { Email } from "../../enterprise/entities/email";

export interface EmailsRepositoryInterface {
  create(email: Email): Promise<void>;
  findById(id: string): Promise<Email | null>;
  save(email: Email): Promise<void>;
}
