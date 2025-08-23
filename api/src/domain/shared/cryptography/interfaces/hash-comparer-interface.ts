export abstract class HashComparerInterface {
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
