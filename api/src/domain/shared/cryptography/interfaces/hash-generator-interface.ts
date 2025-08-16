export interface HashGeneratorInterface {
  hash(plain: string): Promise<string>;
}
