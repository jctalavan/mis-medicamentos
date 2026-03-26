import { NextResponse } from "next/server";

/**
 * Validates the API key from the request headers.
 * Accepts either `X-API-Key` header or `Authorization: Bearer <key>`.
 * Returns null if valid, or a NextResponse with 401 status if invalid.
 */
export function validateApiKey(request: Request): NextResponse | null {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API no configurada. Falta la variable de entorno API_KEY." },
      { status: 500 }
    );
  }

  const xApiKey = request.headers.get("x-api-key");
  const authorization = request.headers.get("authorization");

  let providedKey: string | null = null;

  if (xApiKey) {
    providedKey = xApiKey;
  } else if (authorization?.startsWith("Bearer ")) {
    providedKey = authorization.slice(7);
  }

  if (!providedKey || providedKey !== apiKey) {
    return NextResponse.json(
      { error: "No autorizado. API key inválida o no proporcionada." },
      { status: 401 }
    );
  }

  return null;
}
