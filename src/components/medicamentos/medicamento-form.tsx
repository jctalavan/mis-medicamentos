"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  medicamentoSchema,
  type MedicamentoFormData,
  type Medicamento,
  CATEGORIAS,
  UNIDADES,
} from "@/lib/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MedicamentoFormProps {
  defaultValues?: Partial<Medicamento>;
  onSubmit: (data: MedicamentoFormData) => void;
  isSubmitting?: boolean;
}

export function MedicamentoForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: MedicamentoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicamentoFormData>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      principio_activo: defaultValues?.principio_activo ?? "",
      categoria: defaultValues?.categoria ?? "",
      fecha_caducidad: defaultValues?.fecha_caducidad
        ? format(defaultValues.fecha_caducidad, "yyyy-MM-dd")
        : "",
      cantidad: defaultValues?.cantidad ?? 1,
      unidad: defaultValues?.unidad ?? "comprimidos",
      dosis: defaultValues?.dosis ?? "",
      indicaciones: defaultValues?.indicaciones ?? "",
      notas: defaultValues?.notas ?? "",
    },
  });

  const categoriaValue = watch("categoria");
  const unidadValue = watch("unidad");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="nombre">
          Nombre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nombre"
          placeholder="Ej: Ibuprofeno 600mg"
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="text-sm text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      {/* Principio activo */}
      <div className="space-y-2">
        <Label htmlFor="principio_activo">Principio activo</Label>
        <Input
          id="principio_activo"
          placeholder="Ej: Ibuprofeno"
          {...register("principio_activo")}
        />
      </div>

      {/* Categoría y Fecha caducidad en grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select
            value={categoriaValue}
            onValueChange={(v) => setValue("categoria", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_caducidad">Fecha de caducidad</Label>
          <Input
            id="fecha_caducidad"
            type="date"
            {...register("fecha_caducidad")}
          />
        </div>
      </div>

      {/* Cantidad y Unidad en grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input
            id="cantidad"
            type="number"
            min="0"
            {...register("cantidad")}
          />
          {errors.cantidad && (
            <p className="text-sm text-destructive">
              {errors.cantidad.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Unidad</Label>
          <Select
            value={unidadValue}
            onValueChange={(v) => setValue("unidad", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {UNIDADES.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dosis */}
      <div className="space-y-2">
        <Label htmlFor="dosis">Dosis / Posología</Label>
        <Input
          id="dosis"
          placeholder="Ej: 1 comprimido cada 8 horas"
          {...register("dosis")}
        />
      </div>

      {/* Indicaciones */}
      <div className="space-y-2">
        <Label htmlFor="indicaciones">Indicaciones (¿para qué es?)</Label>
        <Textarea
          id="indicaciones"
          placeholder="Ej: Dolor de cabeza, fiebre..."
          {...register("indicaciones")}
        />
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notas">Notas adicionales</Label>
        <Textarea
          id="notas"
          placeholder="Observaciones, precauciones..."
          {...register("notas")}
        />
      </div>

      {/* Botón submit */}
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {defaultValues?.id ? "Guardar cambios" : "Crear medicamento"}
      </Button>
    </form>
  );
}
