import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { User } from "./user";

export interface CompanyProps {
  cnpj: string;
  name: string;
  createdAt: Date;

  users: User[];
}

export class Company extends AggregateRoot<CompanyProps> {
  get cnpj(): string {
    return this.props.cnpj;
  }

  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get users(): User[] {
    return this.props.users;
  }

  set users(users: User[]) {
    this.props.users = users;
  }

  static create(
    props: Optional<CompanyProps, "createdAt" | "users">,
    id?: UniqueEntityID
  ) {
    const company = new Company(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        users: props.users ?? [],
      },
      id
    );

    return company;
  }
}
