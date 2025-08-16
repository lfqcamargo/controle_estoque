import { DomainEvents } from "@/core/events/domain-events";
import { CompaniesRepositoryInterface } from "@/domain/user/application/interfaces/companies-repository-interface";
import { Company } from "@/domain/user/enterprise/entities/company";

export class InMemoryCompaniesRepository
  implements CompaniesRepositoryInterface
{
  public items: Company[] = [];

  async create(company: Company): Promise<void> {
    this.items.push(company);

    DomainEvents.dispatchEventsForAggregate(company.id);
  }

  async findById(id: string): Promise<Company | null> {
    const company = this.items.find((item) => item.id.toString() === id);
    return company ?? null;
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = this.items.find((item) => item.cnpj === cnpj);
    return company ?? null;
  }

  async save(company: Company): Promise<void> {
    const companyIndex = this.items.findIndex((item) => item.id === company.id);
    this.items[companyIndex] = company;
  }
}
