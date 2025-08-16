import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { Either, right } from "@/core/either";
import { SendEmailResponse } from "@/domain/notification/application/services/email-sender";

export class FakeEmailSender implements EmailSender {
  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    // Simula o envio de email sempre com sucesso
    return right({
      success: true,
    });
  }
} 