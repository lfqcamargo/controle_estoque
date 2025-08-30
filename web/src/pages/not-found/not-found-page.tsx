import { AlertTriangle, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-muted dark:bg-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full flex-col items-center px-12 py-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/30">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Página não encontrada
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              A página que você está procurando não existe ou foi movida.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <div className="mb-6">
              <p className="text-2xl font-bold text-muted-foreground">404</p>
              <p className="text-sm text-muted-foreground">
                Erro - Página não encontrada
              </p>
            </div>

            <Button
              variant="default"
              asChild
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Voltar para o início
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 flex w-full max-w-[500px] justify-center">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:bg-background/10 dark:hover:text-foreground"
          >
            <Link to="/auth/sign-in" className="text-sm">
              Fazer login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
