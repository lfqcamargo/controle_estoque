import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
      envFilePath: process.env.ENV_FILE || '.env',
    }),
    DatabaseModule,
    EnvModule,
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
