"use client";

import { useMedicamentos } from "@/hooks/use-medicamentos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, AlertTriangle, PackageCheck, Activity } from "lucide-react";
import { differenceInDays } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: medicamentos, isLoading } = useMedicamentos({
    search: "",
    categoria: "",
    mostrarCaducados: true,
    mostrarOcultos: false,
  });

  const today = new Date();
  const activos = medicamentos?.filter((m) => m.activo) ?? [];
  const proximosCaducar = activos.filter((m) => {
    if (!m.fecha_caducidad) return false;
    const days = differenceInDays(m.fecha_caducidad, today);
    return days >= 0 && days <= 90;
  });
  const caducados = activos.filter((m) => {
    if (!m.fecha_caducidad) return false;
    return differenceInDays(m.fecha_caducidad, today) < 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Panel de control
        </h1>
        <p className="text-muted-foreground mt-1">
          Resumen de tu botiquín doméstico
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activos.length}</p>
                    <p className="text-xs text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {proximosCaducar.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Por caducar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-100 p-2.5">
                    <Activity className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{caducados.length}</p>
                    <p className="text-xs text-muted-foreground">Caducados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2.5">
                    <PackageCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {medicamentos?.length ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Próximos a caducar */}
          {proximosCaducar.length > 0 && (
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Próximos a caducar
                </h2>
                <div className="space-y-2">
                  {proximosCaducar.map((med) => {
                    const days = differenceInDays(med.fecha_caducidad!, today);
                    return (
                      <Link
                        key={med.id}
                        href={`/medicamentos/${med.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{med.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {med.cantidad} {med.unidad}
                          </p>
                        </div>
                        <Badge variant={days <= 30 ? "danger" : "warning"}>
                          {days} días
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="flex-1 sm:flex-none">
              <Link href="/medicamentos">Ver todos los medicamentos</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Link href="/medicamentos/nuevo">Añadir medicamento</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
