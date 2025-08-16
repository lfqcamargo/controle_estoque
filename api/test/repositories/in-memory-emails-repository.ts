import { EmailsRepositoryInterface } from "@/domain/notification/application/interfaces/emails-repository-interface";
import { Email } from "@/domain/notification/enterprise/entities/email";

export class InMemoryEmailsRepository implements EmailsRepositoryInterface {
  public items: Email[] = [];

  async create(email: Email): Promise<void> {
    this.items.push(email);
  }

  async findById(id: string): Promise<Email | null> {
    const email = this.items.find((item) => item.id.toString() === id);

    if (!email) {
      return null;
    }

    return email;
  }

  async save(email: Email): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(email.id));

    if (itemIndex >= 0) {
      this.items[itemIndex] = email;
    }
  }
}
