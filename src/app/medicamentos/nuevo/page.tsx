"use client";

import { useRouter } from "next/navigation";
import { useCreateMedicamento } from "@/hooks/use-medicamentos";
import { MedicamentoForm } from "@/components/medicamentos/medicamento-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { MedicamentoFormData } from "@/lib/types";

export default function NuevoMedicamentoPage() {
  const router = useRouter();
  const createMutation = useCreateMedicamento();

  const handleSubmit = (data: MedicamentoFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/medicamentos");
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/medicamentos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Nuevo medicamento
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del medicamento</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicamentoForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
