import { Building2, ChevronsUpDown, LogOut, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getAttachement } from "@/api/get-attachement";
import { signOut } from "@/api/user/sign-out";
import { ToastError } from "../toast-error";

export function NavCompany() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getProfileCompany,
  });

  const { data: photoData, isLoading: isPhotoLoading } = useQuery({
    queryKey: ["company-photo", company?.photoId],
    queryFn: () =>
      company?.photoId ? getAttachement({ id: company.photoId }) : null,
    enabled: !!company?.photoId,
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

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (
      words[0].charAt(0).toUpperCase() +
      words[words.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isCompanyLoading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    {!isPhotoLoading && (
                      <>
                        <AvatarImage
                          src={photoData?.url ?? undefined}
                          alt={company?.name}
                        />
                        {!photoData?.url && (
                          <AvatarFallback className="rounded-lg">
                            {company?.name ? getInitials(company.name) : "..."}
                          </AvatarFallback>
                        )}
                      </>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {company?.name}
                    </span>
                    <span className="truncate text-xs">
                      {company?.lealName}
                    </span>
                  </div>
                </>
              )}
              <ChevronsUpDown className="ml-auto size-4" />
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
                      <AvatarImage
                        src={photoData?.url ?? "/placeholder.svg"}
                        alt={company?.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {company?.name ? getInitials(company.name) : "..."}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {company?.name}
                      </span>
                      <span className="truncate text-xs">
                        {company?.lealName}
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
