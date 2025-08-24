import { Injectable } from '@nestjs/common';

import { LinkBuilderInterface } from '@/domain/notification/application/interfaces/link-builder-interface';

import { EnvService } from '../env/env.service';

@Injectable()
export class LinkBuilder implements LinkBuilderInterface {
  constructor(private envService: EnvService) {}

  url(): string {
    return this.envService.get('BASE_URL') as string;
  }
}
