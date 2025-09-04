import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/user/get-profile-user";

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export function useUserRole() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getProfileUser,
  });

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const isEmployee = user?.role === UserRole.EMPLOYEE;

  return {
    user,
    role: user?.role as UserRole | undefined,
    isAdmin,
    isManager,
    isEmployee,
    isLoading,
  };
}
