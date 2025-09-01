import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { getProfileUser } from "@/api/user/get-profile-user";
import { signOut } from "@/api/user/sign-out";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastError } from "../toast-error";

export function NavUser() {
  const { isMobile, state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getProfileUser,
  });

  const { mutateAsync: signOutFn } = useMutation({
    mutationFn: signOut,
  });

  async function handleLogout() {
    try {
      await signOutFn();
      navigate("/auth/sign-in");
    } catch (error) {
      ToastError(error);
    }
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

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
              {isUserLoading ? (
                <>
                  {isCollapsed ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <>
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex-1 space-y-1">
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
                        {user?.name ? getInitials(user.name) : "..."}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {user?.name ? getInitials(user.name) : "..."}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
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
                {isUserLoading ? (
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
                        {user?.name ? getInitials(user.name) : "..."}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 w-full">
                  <BadgeCheck className="h-4 w-4" />
                  Conta
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell className="h-4 w-4" />
                Notificações
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
