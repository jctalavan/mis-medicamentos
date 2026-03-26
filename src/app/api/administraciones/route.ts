import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { administracionSchema } from "@/lib/types";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const medicamentoId = searchParams.get("medicamento_id");

    if (!medicamentoId) {
      return NextResponse.json(
        { error: "El parámetro 'medicamento_id' es obligatorio" },
        { status: 400 }
      );
    }

    const administraciones = await prisma.administracion.findMany({
      where: { medicamento_id: medicamentoId },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(administraciones);
  } catch (error) {
    console.error("Error al obtener administraciones:", error);
    return NextResponse.json(
      { error: "Error al obtener administraciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = administracionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const administracion = await prisma.administracion.create({
      data: {
        medicamento_id: data.medicamento_id,
        fecha: new Date(data.fecha),
        notas: data.notas || null,
      },
    });

    return NextResponse.json(administracion, { status: 201 });
  } catch (error) {
    console.error("Error al crear administración:", error);
    return NextResponse.json(
      { error: "Error al crear administración" },
      { status: 500 }
    );
  }
}
