import { injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { HashGeneratorInterface } from "@/domain/shared/cryptography/interfaces/hash-generator-interface";

@injectable()
export class HashGeneratorHandler implements HashGeneratorInterface {
  private saltRounds = 10;

  async hash(plain: string): Promise<string> {
    const hashed = await bcrypt.hash(plain, this.saltRounds);
    return hashed;
  }
}
