import { getProfileUser } from "@/api/user/get-profile-user";

export async function isAuthenticated() {
  try {
    await getProfileUser();
    return true;
  } catch {
    return false;
  }
}
