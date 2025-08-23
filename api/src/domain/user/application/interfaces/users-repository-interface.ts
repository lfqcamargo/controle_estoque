import { PaginationParams } from '@/core/interfaces/pagination-params';
import { User } from '@/domain/user/enterprise/entities/user';

export abstract class UsersRepositoryInterface {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams,
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
  abstract update(user: User): Promise<void>;
}
