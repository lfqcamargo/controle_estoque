import { Home, Box, BarChart3, Settings } from "lucide-react";
import type { NavItem } from "@/@types/nav";

import { NavMain } from "@/components/side-bar/nav-main";
import { NavUser } from "@/components/side-bar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavCompany } from "./nav-company";
import { useUserRole } from "@/hooks/use-user-role";

const navMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Material",
    url: "#",
    icon: Box,
    items: [
      { title: "Grupos de Material", url: "/groups-materials" },
      { title: "Materiais", url: "/materials" },
    ],
  },
  {
    title: "Estoque",
    url: "#",
    icon: Box,
    items: [
      { title: "Local", url: "/locations" },
      { title: "Sub-Local", url: "/sub-locations" },
      { title: "Fileira", url: "/rows" },
      { title: "Prateleira", url: "/shelfs" },
      { title: "Posição", url: "/positions" },
      { title: "Endereçamento", url: "/addressings" },
    ],
  },
  {
    title: "Movimentações",
    url: "#",
    icon: Box,
    items: [
      { title: "Tipos de Movimentação", url: "/movement-types" },
      { title: "Movimentações", url: "/movements" },
    ],
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
    items: [
      { title: "Estoque Atual", url: "/relatorios/estoque-atual" },
      { title: "Movimentações", url: "/relatorios/movimentacoes" },
      { title: "Análise de Consumo", url: "/relatorios/consumo" },
    ],
  },
  {
    title: "Administração",
    url: "#",
    icon: Settings,
    items: [{ title: "Configurações", url: "/configuracoes" }],
    adminOnly: true,
  },
];

export function AppSidebar() {
  const { isAdmin } = useUserRole();

  const filteredNavItems = navMain.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavCompany />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
