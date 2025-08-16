import bcrypt from "bcrypt";
import { EncrypterInterface } from "@/domain/shared/cryptography/interfaces/encrypter-interface";

export class EncrypterHandler implements EncrypterInterface {
  private saltRounds = 10;

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    const payloadString = JSON.stringify(payload);
    const hashed = await bcrypt.hash(payloadString, this.saltRounds);
    return hashed;
  }
}
