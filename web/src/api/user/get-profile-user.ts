import { api } from "@/lib/axios";

export interface GetProfileUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;

  createdAt: string;
  lastLogin: string;
}

export async function getProfileUser(): Promise<GetProfileUserResponse> {
  const response = await api.get("/users/me");
  return response.data;
}
