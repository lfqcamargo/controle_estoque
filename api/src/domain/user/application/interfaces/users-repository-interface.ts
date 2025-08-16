import { PaginationParams } from "@/core/interfaces/pagination-params";
import { User } from "@/domain/user/enterprise/entities/user";

export interface UsersRepositoryInterface {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: User[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
      totalAdmin: number;
      totalManager: number;
      totalEmployee: number;
      totalActive: number;
      totalInactive: number;
      lastCreated: Date;
    };
  }>;
  update(user: User): Promise<void>;
}
