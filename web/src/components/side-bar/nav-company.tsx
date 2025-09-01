import { Building2, ChevronsUpDown, LogOut, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import { getProfileCompany } from "@/api/user/get-profile-company";
import { signOut } from "@/api/user/sign-out";
import { ToastError } from "../toast-error";
import { getInitials } from "@/utils/get-initials";

export function NavCompany() {
  const { isMobile, state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getProfileCompany,
  });

  const { mutateAsync: signOutFn } = useMutation({ mutationFn: signOut });

  async function handleLogout() {
    try {
      await signOutFn();
      navigate("/auth/sign-in");
    } catch (error) {
      ToastError(error);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={isCollapsed ? "default" : "lg"}
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              {isCompanyLoading ? (
                <>
                  {isCollapsed ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <>
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {isCollapsed ? (
                    <Avatar className="h-8 w-8 rounded-full mx-auto">
                      <AvatarFallback className="rounded-full text-xs font-semibold flex items-center justify-center">
                        {company?.name ? getInitials(company.name) : "..."}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {company?.name ? getInitials(company.name) : "..."}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {company?.name}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
              {!isCollapsed && <ChevronsUpDown className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {isCompanyLoading ? (
                  <>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {company?.name ? getInitials(company.name) : "..."}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {company?.name}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/company" className="flex items-center gap-2 w-full">
                  <Building2 className="h-4 w-4" />
                  Editar Empresa
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/employee" className="flex items-center gap-2 w-full">
                  <Users className="h-4 w-4" />
                  Funcionários
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
