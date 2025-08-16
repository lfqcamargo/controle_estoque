import { TempCompaniesRepositoryInterface } from "@/domain/user/application/interfaces/temp-companies-repository-interface";
import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryTempCompaniesRepository
  implements TempCompaniesRepositoryInterface
{
  public items: TempCompany[] = [];

  async create(tempCompany: TempCompany): Promise<void> {
    this.items.push(tempCompany);

    DomainEvents.dispatchEventsForAggregate(tempCompany.id);
  }

  async findByEmail(email: string): Promise<TempCompany | null> {
    const tempUser = this.items.find((item) => item.email === email);
    return tempUser ?? null;
  }

  async findByCnpj(cnpj: string): Promise<TempCompany | null> {
    const tempCompany = this.items.find((item) => item.cnpj === cnpj);
    return tempCompany ?? null;
  }

  async findByToken(token: string): Promise<TempCompany | null> {
    const tempCompany = this.items.find((item) => item.token === token);
    return tempCompany ?? null;
  }

  async deleteByCnpj(cnpj: string): Promise<void> {
    this.items = this.items.filter((item) => item.cnpj !== cnpj);
  }

  async delete(tempCompany: TempCompany): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === tempCompany.id.toString()
    );
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
