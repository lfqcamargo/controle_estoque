import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { XCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastError } from "@/components/toast-error";
import { confirmEmail } from "@/api/user/confirm-email";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type ConfirmationState = "loading" | "error";

export function ConfirmEmailCompanyPage() {
  const [state, setState] = useState<ConfirmationState>("loading");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasExecuted = useRef(false);

  const token = searchParams.get("token");

  const { mutateAsync: confirmEmailFn } = useMutation({
    mutationFn: confirmEmail,
  });

  useEffect(() => {
    // Previne execução dupla
    if (hasExecuted.current) {
      return;
    }

    async function handleConfirmEmail(token: string) {
      try {
        hasExecuted.current = true;
        const result = await confirmEmailFn({ token });

        toast.success("E-mail confirmado com sucesso.");
        return navigate(
          `/auth/sign-in?email=${encodeURIComponent(result.email)}`,
          {
            replace: true,
          }
        );
      } catch (error) {
        ToastError(error);
        setState("error");
      }
    }

    if (!token) {
      setState("error");
      return;
    }

    handleConfirmEmail(token);
  }, [token, confirmEmailFn, navigate]);

  let content;

  if (state === "loading") {
    content = (
      <>
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/30">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Verificando email
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Aguarde enquanto confirmamos sua conta...
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">
                Processando confirmação...
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (state === "error") {
    content = (
      <>
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Erro na confirmação
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Ocorreu um erro ao confirmar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                Token não encontrado ou já expirado. Tente criar novamente a
                conta.
              </p>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full h-12 bg-primary text-base font-medium"
                >
                  <Link to={"/auth/sign-up"}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Criar nova conta
                  </Link>
                </Button>

                <Link to={"/auth/sign-in"}>
                  <Button variant="outline" className="w-full h-12">
                    Voltar ao login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="flex w-full flex-col items-center px-12 py-8">
      {content}
    </div>
  );
}
