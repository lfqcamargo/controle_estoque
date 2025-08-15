import bcrypt from "bcrypt";
import { Encrypter } from "@/domain/shared/cryptography/encrypter";

export class EncrypterHandler implements Encrypter {
  private saltRounds = 10;

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    const payloadString = JSON.stringify(payload);
    const hashed = await bcrypt.hash(payloadString, this.saltRounds);
    return hashed;
  }
}
