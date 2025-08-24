import { Module } from '@nestjs/common';

import { LinkBuilderInterface } from '@/domain/notification/application/interfaces/link-builder-interface';

import { EnvModule } from '../env/env.module';
import { LinkBuilder } from './link-builder';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: LinkBuilderInterface,
      useClass: LinkBuilder,
    },
  ],
  exports: [LinkBuilderInterface],
})
export class LinkModule {}
