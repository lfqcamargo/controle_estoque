import { EmailSenderInterface } from "@/domain/notification/application/interfaces/email-sender-interface";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { Either, right } from "@/core/either";
import { SendEmailResponse } from "@/domain/notification/application/interfaces/email-sender-interface";

export class FakeEmailSender implements EmailSenderInterface {
  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    return right({
      success: true,
    });
  }
}
