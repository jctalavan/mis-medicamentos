import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { medicamentoSchema } from "@/lib/types";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoria = searchParams.get("categoria") || "";
    const mostrarCaducados = searchParams.get("mostrarCaducados") === "true";
    const mostrarOcultos = searchParams.get("mostrarOcultos") === "true";

    const where: Prisma.MedicamentoWhereInput = {};

    if (search.trim()) {
      where.nombre = { contains: search.trim(), mode: "insensitive" };
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (!mostrarOcultos) {
      where.activo = true;
    }

    if (!mostrarCaducados) {
      where.OR = [
        { fecha_caducidad: { gte: new Date() } },
        { fecha_caducidad: null },
      ];
    }

    const medicamentos = await prisma.medicamento.findMany({
      where,
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(medicamentos);
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    return NextResponse.json(
      { error: "Error al obtener medicamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = medicamentoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
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

    return NextResponse.json(medicamento, { status: 201 });
  } catch (error) {
    console.error("Error al crear medicamento:", error);
    return NextResponse.json(
      { error: "Error al crear medicamento" },
      { status: 500 }
    );
  }
}
