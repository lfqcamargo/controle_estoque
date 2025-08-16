import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";

export interface TempCompaniesRepositoryInterface {
  create(tempCompany: TempCompany): Promise<void>;
  findByEmail(email: string): Promise<TempCompany | null>;
  findByCnpj(cnpj: string): Promise<TempCompany | null>;
  findByToken(token: string): Promise<TempCompany | null>;
  delete(tempCompany: TempCompany): Promise<void>;
  deleteByCnpj(cnpj: string): Promise<void>;
}
