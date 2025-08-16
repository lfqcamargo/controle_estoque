import { Company } from "@/domain/user/enterprise/entities/company";

export interface CompaniesRepositoryInterface {
  create(company: Company): Promise<void>;
  findById(id: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  save(company: Company): Promise<void>;
}
