import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EncrypterInterface } from '@/domain/shared/cryptography/interfaces/encrypter-interface';

@Injectable()
export class JwtEncrypter implements EncrypterInterface {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
