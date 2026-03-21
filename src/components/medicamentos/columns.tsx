"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIAS } from "@/lib/types";
import type { Medicamento } from "@/lib/types";
import { format, differenceInDays } from "date-fns";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

function getCaducidadBadge(fechaCaducidad: Date | null) {
  if (!fechaCaducidad) {
    return <Badge variant="secondary">Sin fecha</Badge>;
  }

  const today = new Date();
  const daysLeft = differenceInDays(fechaCaducidad, today);

  if (daysLeft < 0) {
    return <Badge variant="danger">Caducado</Badge>;
  }
  if (daysLeft <= 90) {
    return (
      <Badge variant="warning">
        {daysLeft} días
      </Badge>
    );
  }
  return (
    <Badge variant="success">
      {format(fechaCaducidad, "dd/MM/yyyy")}
    </Badge>
  );
}

function getCategoriaLabel(categoria: string | null) {
  if (!categoria) return "—";
  const found = CATEGORIAS.find((c) => c.value === categoria);
  return found ? found.label : categoria;
}

interface ColumnActions {
  onToggle: (id: string, activo: boolean) => void;
  onDelete: (id: string) => void;
}

export function createColumns(actions: ColumnActions): ColumnDef<Medicamento>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="min-w-[150px]">
          <Link
            href={`/medicamentos/${row.original.id}`}
            className="font-medium text-primary hover:underline"
          >
            {row.original.nombre}
          </Link>
          {row.original.principio_activo && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {row.original.principio_activo}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      cell: ({ row }) => (
        <span className="text-sm">{getCategoriaLabel(row.original.categoria)}</span>
      ),
    },
    {
      accessorKey: "fecha_caducidad",
      header: "Caducidad",
      cell: ({ row }) => getCaducidadBadge(row.original.fecha_caducidad),
    },
    {
      accessorKey: "cantidad",
      header: "Stock",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.cantidad} {row.original.unidad}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => {
        const med = row.original;
        return (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/medicamentos/${med.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => actions.onToggle(med.id, !med.activo)}
              title={med.activo ? "Ocultar" : "Mostrar"}
            >
              {med.activo ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => actions.onDelete(med.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
