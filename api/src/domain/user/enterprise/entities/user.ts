import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { PasswordChangeEvent } from "../events/password-change.event";

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export interface UserProps {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  lastLogin?: Date | null;

  companyId: UniqueEntityID;
}

export class User extends AggregateRoot<UserProps> {
  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;

    this.addDomainEvent(new PasswordChangeEvent(this));
  }

  get role(): UserRole {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  get active(): boolean {
    return this.props.active;
  }

  set active(active: boolean) {
    this.props.active = active;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastLogin(): Date | null {
    return this.props.lastLogin ?? null;
  }

  set lastLogin(lastLogin: Date | null) {
    this.props.lastLogin = lastLogin;
  }

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  static create(
    props: Optional<UserProps, "createdAt" | "active">,
    id?: UniqueEntityID
  ) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
        active: props.active ?? false,
        lastLogin: props.lastLogin ?? null,
      },
      id
    );

    return user;
  }
}
