import { LinkBuilderInterface } from "@/domain/notification/application/interfaces/link-builder-interface";
import { env } from "@/infra/env";
import { injectable } from "tsyringe";

@injectable()
export class LinkBuilder implements LinkBuilderInterface {
  private baseUrl = env.BASE_URL;

  url() {
    return this.baseUrl;
  }
}
