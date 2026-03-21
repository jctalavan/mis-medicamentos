"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMedicamento, useUpdateMedicamento } from "@/hooks/use-medicamentos";
import { MedicamentoForm } from "@/components/medicamentos/medicamento-form";
import { Historial } from "@/components/administraciones/historial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { MedicamentoFormData } from "@/lib/types";

export default function EditMedicamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: medicamento, isLoading } = useMedicamento(id);
  const updateMutation = useUpdateMedicamento();

  const handleSubmit = (data: MedicamentoFormData) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/medicamentos");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!medicamento) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-muted-foreground">Medicamento no encontrado.</p>
        <Button asChild variant="outline">
          <Link href="/medicamentos">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/medicamentos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {medicamento.nombre}
          </h1>
          {!medicamento.activo && (
            <p className="text-sm text-muted-foreground">
              Este medicamento está oculto
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Editar información</CardTitle>
          </CardHeader>
          <CardContent>
            <MedicamentoForm
              defaultValues={medicamento}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Historial */}
        <div className="space-y-4">
          <Historial medicamentoId={id} />
        </div>
      </div>
    </div>
  );
}
