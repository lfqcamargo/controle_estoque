import "reflect-metadata";
import { describe, it, beforeEach, expect } from "vitest";
import { SendEmailUseCase } from "./send-email";
import { DomainEvents } from "@/core/events/domain-events";
import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/notification/fake-email-sender";

let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let sendEmail: SendEmailUseCase;

describe("Send Email Use Case", () => {
  beforeEach(() => {
    DomainEvents.clearHandlers();
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();

    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);
  });

  it("should be able to send an email", async () => {
    const result = await sendEmail.execute({
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
      from: "noreply@example.com",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const email = result.value.email;
      expect(email.to).toBe("test@example.com");
      expect(email.subject).toBe("Test Subject");
      expect(email.body).toBe("Test Body");
      expect(email.from).toBe("noreply@example.com");
      expect(email.sentAt).toBeDefined();
    }

    expect(inMemoryEmailsRepository.items).toHaveLength(1);
    const savedEmail = inMemoryEmailsRepository.items[0]!;
    expect(savedEmail.to).toBe("test@example.com");
  });

  it("should be able to send an email without from field", async () => {
    const result = await sendEmail.execute({
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const email = result.value.email;
      expect(email.from).toBeNull();
    }
  });
});
