import { Prisma,TempCompany as PrismaTempCompany } from "generated/prisma";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";

export class PrismaTempCompanyMapper {
  static toDomain(raw: PrismaTempCompany): TempCompany {
    return TempCompany.create(
      {
        cnpj: raw.cnpj,
        companyName: raw.companyName,
        email: raw.email,
        userName: raw.userName,
        password: raw.password,
        token: raw.token,
        expiration: raw.expiration,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    tempCompany: TempCompany
  ): Prisma.TempCompanyUncheckedCreateInput {
    return {
      id: tempCompany.id.toString(),
      cnpj: tempCompany.cnpj,
      companyName: tempCompany.companyName,
      email: tempCompany.email,
      userName: tempCompany.userName,
      password: tempCompany.password,
      token: tempCompany.token,
      expiration: tempCompany.expiration,
    };
  }
}
