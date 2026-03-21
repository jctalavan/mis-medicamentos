import { z } from "zod";

// Re-export Prisma generated types
export type { Medicamento, Administracion } from "@prisma/client";

// ─── Constantes ────────────────────────────────────────────────

export const CATEGORIAS = [
  { value: "analgesico", label: "Analgésico" },
  { value: "antibiotico", label: "Antibiótico" },
  { value: "antiinflamatorio", label: "Antiinflamatorio" },
  { value: "antihistaminico", label: "Antihistamínico" },
  { value: "antiacido", label: "Antiácido" },
  { value: "antitusivo", label: "Antitusivo" },
  { value: "laxante", label: "Laxante" },
  { value: "vitamina", label: "Vitamina/Suplemento" },
  { value: "crema", label: "Crema/Pomada" },
  { value: "otro", label: "Otro" },
] as const;

export const UNIDADES = [
  { value: "comprimidos", label: "Comprimidos" },
  { value: "capsulas", label: "Cápsulas" },
  { value: "sobres", label: "Sobres" },
  { value: "ml", label: "Mililitros (ml)" },
  { value: "ampollas", label: "Ampollas" },
  { value: "parches", label: "Parches" },
  { value: "supositorios", label: "Supositorios" },
  { value: "gotas", label: "Gotas" },
  { value: "inhalaciones", label: "Inhalaciones" },
  { value: "unidades", label: "Unidades" },
] as const;

export type CategoriaValue = (typeof CATEGORIAS)[number]["value"];
export type UnidadValue = (typeof UNIDADES)[number]["value"];

// ─── Schemas Zod ───────────────────────────────────────────────

export const medicamentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  principio_activo: z.string().optional().default(""),
  categoria: z.string().optional().default(""),
  fecha_caducidad: z.string().optional().default(""),
  cantidad: z.coerce.number().min(0, "La cantidad no puede ser negativa").default(1),
  unidad: z.string().default("comprimidos"),
  dosis: z.string().optional().default(""),
  indicaciones: z.string().optional().default(""),
  notas: z.string().optional().default(""),
});

export type MedicamentoFormData = z.infer<typeof medicamentoSchema>;

export const administracionSchema = z.object({
  medicamento_id: z.string().uuid(),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  notas: z.string().optional().default(""),
});

export type AdministracionFormData = z.infer<typeof administracionSchema>;

// ─── Filtros ───────────────────────────────────────────────────

export interface MedicamentoFilters {
  search: string;
  categoria: string;
  mostrarCaducados: boolean;
  mostrarOcultos: boolean;
}
