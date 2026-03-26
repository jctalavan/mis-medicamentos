import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { medicamentoSchema } from "@/lib/types";
import { Prisma } from "@prisma/client";

function isPrismaNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const medicamento = await prisma.medicamento.findUnique({
      where: { id },
    });

    if (!medicamento) {
      return NextResponse.json(
        { error: "Medicamento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(medicamento);
  } catch (error) {
    console.error("Error al obtener medicamento:", error);
    return NextResponse.json(
      { error: "Error al obtener medicamento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = medicamentoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
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

    return NextResponse.json(medicamento);
  } catch (error) {
    if (isPrismaNotFound(error)) {
      return NextResponse.json(
        { error: "Medicamento no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error al actualizar medicamento:", error);
    return NextResponse.json(
      { error: "Error al actualizar medicamento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.medicamento.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isPrismaNotFound(error)) {
      return NextResponse.json(
        { error: "Medicamento no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error al eliminar medicamento:", error);
    return NextResponse.json(
      { error: "Error al eliminar medicamento" },
      { status: 500 }
    );
  }
}
