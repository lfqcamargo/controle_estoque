import { compare,hash } from 'bcryptjs';

import { HashComparerInterface } from '@/domain/shared/cryptography/interfaces/hash-comparer-interface';
import { HashGeneratorInterface } from '@/domain/shared/cryptography/interfaces/hash-generator-interface';

export class BcryptHasher
  implements HashGeneratorInterface, HashComparerInterface
{
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
