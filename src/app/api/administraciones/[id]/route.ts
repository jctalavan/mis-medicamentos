import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.administracion.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar administración:", error);
    return NextResponse.json(
      { error: "Error al eliminar administración" },
      { status: 500 }
    );
  }
}
