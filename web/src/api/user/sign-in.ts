import { api } from "@/lib/axios";

interface SignInRequest {
  email: string;
  password: string;
}

type SignInResponse = void;

export async function signIn({
  email,
  password,
}: SignInRequest): Promise<SignInResponse> {
  await api.post("/auth/", { email, password });
}
