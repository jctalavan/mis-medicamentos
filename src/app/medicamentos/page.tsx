"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useMedicamentos,
  useToggleMedicamento,
  useDeleteMedicamento,
} from "@/hooks/use-medicamentos";
import { DataTable } from "@/components/medicamentos/data-table";
import { createColumns } from "@/components/medicamentos/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS, type MedicamentoFilters } from "@/lib/types";
import { Plus, Search, Loader2, Filter } from "lucide-react";

export default function MedicamentosPage() {
  const [filters, setFilters] = useState<MedicamentoFilters>({
    search: "",
    categoria: "",
    mostrarCaducados: false,
    mostrarOcultos: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: medicamentos, isLoading } = useMedicamentos(filters);
  const toggleMutation = useToggleMedicamento();
  const deleteMutation = useDeleteMedicamento();

  const columns = useMemo(
    () =>
      createColumns({
        onToggle: (id, activo) => toggleMutation.mutate({ id, activo }),
        onDelete: (id) => {
          if (
            confirm("¿Estás seguro de que quieres eliminar este medicamento?")
          ) {
            deleteMutation.mutate(id);
          }
        },
      }),
    [toggleMutation, deleteMutation],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Medicamentos
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {medicamentos?.length ?? 0} medicamentos encontrados
          </p>
        </div>
        <Button asChild className="gap-2 w-full sm:w-auto">
          <Link href="/medicamentos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo medicamento
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Extended filters panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border bg-card animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <Label className="text-xs">Categoría</Label>
              <Select
                value={filters.categoria}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    categoria: v === "todas" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 sm:justify-center">
              <Switch
                id="show-expired"
                checked={filters.mostrarCaducados}
                onCheckedChange={(v) =>
                  setFilters((f) => ({ ...f, mostrarCaducados: v }))
                }
              />
              <Label htmlFor="show-expired" className="text-sm cursor-pointer">
                Mostrar caducados
              </Label>
            </div>

            <div className="flex items-center gap-3 sm:justify-center">
              <Switch
                id="show-hidden"
                checked={filters.mostrarOcultos}
                onCheckedChange={(v) =>
                  setFilters((f) => ({ ...f, mostrarOcultos: v }))
                }
              />
              <Label htmlFor="show-hidden" className="text-sm cursor-pointer">
                Mostrar ocultos
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* Table / Mobile cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <DataTable columns={columns} data={medicamentos ?? []} />
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden space-y-3">
            {!medicamentos?.length ? (
              <div className="text-center py-12 text-muted-foreground">
                No se encontraron medicamentos.
              </div>
            ) : (
              medicamentos.map((med) => (
                <Link
                  key={med.id}
                  href={`/medicamentos/${med.id}`}
                  className="block rounded-xl border bg-card p-4 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {med.nombre}
                      </h3>
                      {med.principio_activo && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {med.principio_activo}
                        </p>
                      )}
                    </div>
                    {!med.activo && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Oculto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {med.categoria && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-md">
                        {
                          CATEGORIAS.find((c) => c.value === med.categoria)
                            ?.label
                        }
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {med.cantidad} {med.unidad}
                    </span>
                    {med.fecha_caducidad && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          med.fecha_caducidad < new Date()
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {med.fecha_caducidad.toLocaleDateString("es-ES")}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
