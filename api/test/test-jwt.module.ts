import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      privateKey: Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64'),
      publicKey: Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64'),
      signOptions: { algorithm: 'RS256' },
    }),
  ],
  exports: [JwtModule],
})
export class TestJwtModule {}
