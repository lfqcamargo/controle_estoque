export interface HashComparerInterface {
  compare(plain: string, hash: string): Promise<boolean>;
}
