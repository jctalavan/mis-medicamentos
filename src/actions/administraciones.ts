"use server";

import { prisma } from "@/lib/prisma";

export async function getAdministraciones(medicamentoId: string) {
  const administraciones = await prisma.administracion.findMany({
    where: { medicamento_id: medicamentoId },
    orderBy: { fecha: "desc" },
  });

  return administraciones;
}

export async function createAdministracion(data: {
  medicamento_id: string;
  fecha: string;
  notas?: string;
}) {
  const administracion = await prisma.administracion.create({
    data: {
      medicamento_id: data.medicamento_id,
      fecha: new Date(data.fecha),
      notas: data.notas || null,
    },
  });

  return administracion;
}

export async function deleteAdministracion(id: string) {
  await prisma.administracion.delete({
    where: { id },
  });
}
