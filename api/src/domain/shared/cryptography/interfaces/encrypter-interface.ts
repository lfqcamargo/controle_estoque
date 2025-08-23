export abstract class EncrypterInterface {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
