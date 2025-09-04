import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  editCompanyNameSchema,
  type EditCompanyNameFormData,
} from "../lib/validations";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { editCompany } from "@/api/user/edit-company";
import { getProfileCompany } from "@/api/user/get-profile-company";
import { ToastError } from "@/components/toast-error";
import { toast } from "sonner";
import { formatCNPJ } from "@/utils/validate-cnpj";

export function CompanyForm() {
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getProfileCompany,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditCompanyNameFormData>({
    resolver: zodResolver(editCompanyNameSchema),
    defaultValues: {
      name: company?.name || "",
    },
  });

  const { mutateAsync: editCompanyNameFn } = useMutation({
    mutationFn: editCompany,
  });

  React.useEffect(() => {
    if (company) {
      reset({
        name: company.name,
      });
    }
  }, [company, reset]);

  async function onSubmit(data: EditCompanyNameFormData) {
    try {
      await editCompanyNameFn({ name: data.name });

      queryClient.invalidateQueries({ queryKey: ["company"] });

      toast.success("Nome da empresa atualizado com sucesso!");
    } catch (error) {
      ToastError(error);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="cnpj"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <FileText className="w-4 h-4" />
          CNPJ
        </Label>
        <Input
          id="cnpj"
          value={company ? formatCNPJ(company.cnpj) : ""}
          disabled
          className="bg-muted/50 text-muted-foreground cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">
          O CNPJ não pode ser alterado
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Building2 className="w-4 h-4" />
          Nome da Empresa *
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Digite o nome da empresa"
          className={
            errors.name
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
