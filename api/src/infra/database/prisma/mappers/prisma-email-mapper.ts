import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Email } from "@/domain/notification/enterprise/entities/email";

import { Email as PrismaEmail } from "../../../../../generated/prisma";

export class PrismaEmailMapper {
  static toDomain(raw: PrismaEmail): Email {
    return Email.create(
      {
        to: raw.to,
        subject: raw.subject,
        body: raw.body,
        from: raw.from,
        createdAt: raw.createdAt,
        sentAt: raw.sentAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(email: Email) {
    return {
      id: email.id.toString(),
      to: email.to,
      subject: email.subject,
      body: email.body,
      from: email.from,
      createdAt: email.createdAt,
      sentAt: email.sentAt,
    };
  }
}
