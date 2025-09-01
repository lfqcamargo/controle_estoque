import { api } from "@/lib/axios";

interface SignUpRequest {
  cnpj: string;
  companyName: string;
  email: string;
  userName: string;
  password: string;
}

type SignUpResponse = void;

export async function signUp({
  cnpj,
  companyName,
  email,
  userName,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post("/companies", {
    cnpj,
    companyName,
    email,
    userName,
    password,
  });
};
