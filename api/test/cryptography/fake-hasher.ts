import { HashComparerInterface } from "@/domain/shared/cryptography/interfaces/hash-comparer-interface";
import { HashGeneratorInterface } from "@/domain/shared/cryptography/interfaces/hash-generator-interface";

export class FakeHasher
  implements HashGeneratorInterface, HashComparerInterface
{
  async hash(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("-hashed") === hash;
  }
}
