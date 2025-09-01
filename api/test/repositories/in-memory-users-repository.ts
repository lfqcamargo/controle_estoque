import { UsersRepositoryInterface } from '@/domain/user/application/interfaces/users-repository-interface';
import { User } from '@/domain/user/enterprise/entities/user';
import { PaginationParams } from '@/core/interfaces/pagination-params';

export class InMemoryUsersRepository implements UsersRepositoryInterface {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    if (user) {
      this.items.push(user);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email);
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(item => item.id.toString() === id);
    return user ?? null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const users = this.items.filter(
      item => item.companyId.toString() === companyId,
    );

    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    const paginatedUsers = users.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    );

    const totalActive = users.filter(user => user.active).length;
    const totalInactive = totalItems - totalActive;

    const totalAdmin = users.filter(user => user.role === 'ADMIN').length;
    const totalManager = users.filter(user => user.role === 'MANAGER').length;
    const totalEmployee = users.filter(user => user.role === 'EMPLOYEE').length;

    const lastCreatedUser = users.reduce((latest, user) => {
      const userDate = new Date(user.createdAt);
      return userDate > latest ? userDate : latest;
    }, new Date());

    return {
      data: paginatedUsers,
      meta: {
        totalItems,
        itemCount: paginatedUsers.length,
        itemsPerPage,
        totalPages,
        currentPage,
        totalAdmin,
        totalManager,
        totalEmployee,
        totalActive,
        totalInactive,
        lastCreated: lastCreatedUser,
      },
    };
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex(item => item.id === user.id);
    this.items[index] = user;

    if (this.items[index].password != user.password) {
      // Delete Relation Password Tokens
    }
  }
}
