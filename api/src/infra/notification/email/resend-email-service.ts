import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { Either, right, left } from "@/core/either";
import { SendEmailResponse } from "@/domain/notification/application/services/email-sender";
import { Resend } from "resend";
import { injectable } from "tsyringe";

@injectable()
export class ResendEmailService implements EmailSender {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    try {
      const { error } = await this.resend.emails.send({
        from: email.from ?? "Sistema <noreply@resend.dev>",
        to: email.to,
        subject: email.subject,
        html: email.body,
      });

      if (error) {
        console.error("❌ Erro Resend:", error);
        return left(new Error("Erro ao enviar e-mail com Resend"));
      }

      console.log("📧 Email enviado com sucesso via Resend!");
      return right({ success: true });
    } catch (err) {
      console.error("❌ Erro inesperado:", err);
      return left(new Error("Falha ao enviar e-mail com Resend"));
    }
  }
}
