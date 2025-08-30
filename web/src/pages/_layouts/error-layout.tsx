import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function ErrorLayout() {
  return (
    <div className="min-h-screen bg-muted dark:bg-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
} 