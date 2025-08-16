export interface EncrypterInterface {
  encrypt(payload: Record<string, unknown>): Promise<string>;
}
