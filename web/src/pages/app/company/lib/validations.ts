import { z } from "zod";

export const editCompanyNameSchema = z.object({
  name: z
    .string({
      required_error: "CNPJ é obrigatório",
      invalid_type_error: "CNPJ deve ser uma string",
    })
    .min(3, "Nome da empresa deve ter pelo menos 3 caracteres")
    .max(100, "Nome da empresa deve ter no máximo 100 caracteres"),
});

export type EditCompanyNameFormData = z.infer<typeof editCompanyNameSchema>;
