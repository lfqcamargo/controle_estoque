import { api } from "@/lib/axios";

interface EditCompanyRequest {
  name: string;
}

type EditCompanyResponse = void;

export async function editCompany({
  name,
}: EditCompanyRequest): Promise<EditCompanyResponse> {
  await api.put("/companies", {
    name,
  });
}
