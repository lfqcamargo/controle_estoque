import { Company } from '@/domain/user/enterprise/entities/company';

export class CompanyPresenter {
  static toHTTP(company: Company) {
    return {
      id: company.id.toString(),
      cnpj: company.cnpj,
      name: company.name,
      createdAt: company.createdAt.toISOString(),
    };
  }
}
