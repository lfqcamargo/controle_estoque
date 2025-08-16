import {
  EmailSenderInterface,
  SendEmailResponse,
} from "@/domain/notification/application/interfaces/email-sender-interface";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { Either, right } from "@/core/either";

export class FakeEmailSender implements EmailSenderInterface {
  public sentEmails: Email[] = [];

  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    this.sentEmails.push(email);

    return right({ success: true });
  }
}
