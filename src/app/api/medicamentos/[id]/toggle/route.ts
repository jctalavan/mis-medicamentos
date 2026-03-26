import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.activo !== "boolean") {
      return NextResponse.json(
        { error: "El campo 'activo' (boolean) es obligatorio" },
        { status: 400 }
      );
    }

    const medicamento = await prisma.medicamento.update({
      where: { id },
      data: { activo: body.activo },
    });

    return NextResponse.json(medicamento);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Medicamento no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error al cambiar estado del medicamento:", error);
    return NextResponse.json(
      { error: "Error al cambiar estado del medicamento" },
      { status: 500 }
    );
  }
}
