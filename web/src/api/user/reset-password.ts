import { api } from "@/lib/axios";

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ResetPasswordResponse {
  email: string;
}

export async function resetPassword({
  token,
  password,
}: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const result = await api.post(`/users/password/reset/${token}`, {
    password,
  });

  return result.data;
}
