import { injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { HashGenerator } from "@/domain/shared/cryptography/hash-generator";

@injectable()
export class HashGeneratorHandler implements HashGenerator {
  private saltRounds = 10;

  async hash(plain: string): Promise<string> {
    const hashed = await bcrypt.hash(plain, this.saltRounds);
    return hashed;
  }
}
