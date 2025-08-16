import { Email } from "../../enterprise/entities/email";
import { Either } from "@/core/either";

export interface SendEmailResponse {
  success: boolean;
  error?: string;
}

export interface EmailSenderInterface {
  sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>>;
}
