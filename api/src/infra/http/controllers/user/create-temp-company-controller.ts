import { injectable, inject } from "tsyringe";
import { CreateTempCompanyUseCase } from "@/domain/user/application/use-cases/create-temp-company";
import z from "zod";
import { validateCNPJ } from "@/utils/validate-cnpj";
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { AlreadyExistsCnpjError } from "@/domain/user/application/use-cases/errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "@/domain/user/application/use-cases/errors/already-exists-email-error";

const createTempUserBodySchema = z.object({
  cnpj: z
    .string()
    .length(14, "CNPJ must be exactly 14 characters")
    .regex(/^\d+$/, "CNPJ must contain only numbers")
    .transform((cnpj) => cnpj.trim())
    .refine((cnpj) => validateCNPJ(cnpj), {
      message: "invalid CNPJ",
    }),

  companyName: z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(255, "Company name must be at most 255 characters")
    .regex(
      /^[\p{L}0-9&.,\-()\s]+$/u,
      "Company name contains invalid characters"
    )
    .transform((name) => name.trim().replace(/\s+/g, " "))
    .transform((name) =>
      name
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    ),

  userName: z
    .string()
    .min(3, "User name must be at least 3 characters")
    .max(255, "User name must be at most 255 characters")
    .regex(
      /^[\p{L}]+([\p{L}\s']+)?$/u,
      "Username must contain only letters and spaces"
    )
    .transform((name) => name.trim().replace(/\s+/g, " "))
    .transform((name) =>
      name
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    ),

  email: z.email().transform((email) => email.toLowerCase().trim()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});

@injectable()
export class CreateTempCompanyController {
  constructor(
    @inject(CreateTempCompanyUseCase)
    private createTempCompanyUseCase: CreateTempCompanyUseCase
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { cnpj, companyName, email, userName, password } =
      createTempUserBodySchema.parse(request.body);

    const result = await this.createTempCompanyUseCase.execute({
      cnpj,
      companyName,
      email,
      userName,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof AlreadyExistsCnpjError) {
        return reply.status(404).send({ message: error.message });
      }

      if (error instanceof AlreadyExistsEmailError) {
        return reply.status(404).send({ message: error.message });
      }

      return reply.status(500).send({ message: "Internal Server Error" });
    }

    return reply.status(201).send();
  }
}
