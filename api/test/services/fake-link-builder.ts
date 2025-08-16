import { LinkBuilderInterface } from "@/domain/notification/application/interfaces/link-builder-interface";

export class FakeLinkBuilder implements LinkBuilderInterface {
  url() {
    return "test/";
  }
}
