// AppLayout.tsx
import { isAuthenticated } from "@/auth/is-authenticate";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/side-bar/app-sidebar";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        navigate("/auth/sign-in", { replace: true });
      } else {
        setLoading(false);
      }
    }

    checkAuth();
  }, [location.pathname, navigate]);

  if (loading) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
