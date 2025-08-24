import { Module } from '@nestjs/common';

import { EncrypterInterface } from '@/domain/shared/cryptography/interfaces/encrypter-interface';
import { HashComparerInterface } from '@/domain/shared/cryptography/interfaces/hash-comparer-interface';
import { HashGeneratorInterface } from '@/domain/shared/cryptography/interfaces/hash-generator-interface';

import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    { provide: EncrypterInterface, useClass: JwtEncrypter },
    { provide: HashComparerInterface, useClass: BcryptHasher },
    { provide: HashGeneratorInterface, useClass: BcryptHasher },
  ],
  exports: [EncrypterInterface, HashComparerInterface, HashGeneratorInterface],
})
export class CryptographyModule {}
