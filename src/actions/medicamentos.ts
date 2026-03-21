"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { MedicamentoFormData } from "@/lib/types";

export interface MedicamentoFiltersInput {
  search: string;
  categoria: string;
  mostrarCaducados: boolean;
  mostrarOcultos: boolean;
}

export async function getMedicamentos(filters: MedicamentoFiltersInput) {
  const where: Prisma.MedicamentoWhereInput = {};

  // Filtro por nombre
  if (filters.search.trim()) {
    where.nombre = { contains: filters.search.trim(), mode: "insensitive" };
  }

  // Filtro por categoría
  if (filters.categoria) {
    where.categoria = filters.categoria;
  }

  // Filtro: no mostrar ocultos por defecto
  if (!filters.mostrarOcultos) {
    where.activo = true;
  }

  // Filtro: no mostrar caducados por defecto
  if (!filters.mostrarCaducados) {
    where.OR = [
      { fecha_caducidad: { gte: new Date() } },
      { fecha_caducidad: null },
    ];
  }

  const medicamentos = await prisma.medicamento.findMany({
    where,
    orderBy: { nombre: "asc" },
  });

  return medicamentos;
}

export async function getMedicamento(id: string) {
  const medicamento = await prisma.medicamento.findUnique({
    where: { id },
  });

  return medicamento;
}

export async function createMedicamento(data: MedicamentoFormData) {
  const medicamento = await prisma.medicamento.create({
    data: {
      nombre: data.nombre,
      principio_activo: data.principio_activo || null,
      categoria: data.categoria || null,
      fecha_caducidad: data.fecha_caducidad
        ? new Date(data.fecha_caducidad)
        : null,
      cantidad: data.cantidad,
      unidad: data.unidad,
      dosis: data.dosis || null,
      indicaciones: data.indicaciones || null,
      notas: data.notas || null,
      activo: true,
    },
  });

  return medicamento;
}

export async function updateMedicamento(id: string, data: MedicamentoFormData) {
  const medicamento = await prisma.medicamento.update({
    where: { id },
    data: {
      nombre: data.nombre,
      principio_activo: data.principio_activo || null,
      categoria: data.categoria || null,
      fecha_caducidad: data.fecha_caducidad
        ? new Date(data.fecha_caducidad)
        : null,
      cantidad: data.cantidad,
      unidad: data.unidad,
      dosis: data.dosis || null,
      indicaciones: data.indicaciones || null,
      notas: data.notas || null,
    },
  });

  return medicamento;
}

export async function toggleMedicamento(id: string, activo: boolean) {
  await prisma.medicamento.update({
    where: { id },
    data: { activo },
  });
}

export async function deleteMedicamento(id: string) {
  await prisma.medicamento.delete({
    where: { id },
  });
}
