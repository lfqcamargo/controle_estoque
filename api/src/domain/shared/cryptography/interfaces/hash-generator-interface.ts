export abstract class HashGeneratorInterface {
  abstract hash(plain: string): Promise<string>;
}
