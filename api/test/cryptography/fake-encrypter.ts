import { EncrypterInterface } from "@/domain/shared/cryptography/interfaces/encrypter-interface";

export class FakeEncrypter implements EncrypterInterface {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
