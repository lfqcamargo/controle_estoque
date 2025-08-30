import { AxiosError } from "axios";
import { toast } from "sonner";

interface AxiosErrorResponseData {
  statusCode: number;
  message: string;
  error: string;
}

export function ToastError(error: unknown) {
  if (error instanceof AxiosError) {
    const response = error.response;

    if (!response) {
      return toast.error(
        "Erro ao realizar procedimento. Sem resposta do servidor."
      );
    }

    const data = response.data as AxiosErrorResponseData;
    console.log(data.message)

    switch (data.message) {
      case "Validation failed":
        return toast.error("Dados informados não estão corretos.");
      case "CNPJ already exists.":
        return toast.error("CNPJ já está cadastrado.");
      case "Email already exists.":
        return toast.error("E-mail já cadastrado.");
      case "Resource token not found.":
        return toast.error("Token não encontrado.");
      case "Credentials are not valid.":
        return toast.error("Credenciais Inválidas.");
      case "User not found.":
        return toast.error("Usuário não encontrado.");
      case "Not allowed to perform this action.":
        return toast.error("Essa ação não é permitida no sistema.");
      case "There are active materials in the system.":
        return toast.error("Existem materiais ativos no sistema.");
      case "Token expired.":
        return toast.error("Token já expirou.")
      default:
        return toast.error("Erro interno do servidor.");
    }
  }

  return toast.error(
    "Erro ao realizar procedimento. Sem resposta do servidor."
  );
}
