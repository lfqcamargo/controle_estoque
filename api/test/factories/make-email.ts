import { Email } from "@/domain/notification/enterprise/entities/email";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export function makeEmail(
  override: Partial<Email["props"]> = {},
  id?: UniqueEntityID
) {
  const email = Email.create(
    {
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
      from: "noreply@example.com",
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return email;
} 