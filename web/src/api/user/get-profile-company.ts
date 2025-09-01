import { api } from "@/lib/axios";

export interface GetProfileCompanyResponse {
  id: string;
  cnpj: string;
  name: string;
  createdAt: string;
}

export async function getProfileCompany(): Promise<GetProfileCompanyResponse> {
  const response = await api.get("/companies/me");

  return response.data;
}
