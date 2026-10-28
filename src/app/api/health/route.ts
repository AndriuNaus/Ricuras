import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/health — chequeo público de que la app y Supabase responden.
 * Es pública a propósito (sirve para monitoreo), por eso NO devuelve URLs,
 * mensajes de error ni stack traces: esos detalles quedan solo en los logs.
 */

// Siempre en vivo: sin esto Next la genera una sola vez al compilar
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true });

    if (error) console.error("Health check error:", error);
    return NextResponse.json({ ok: !error }, { status: error ? 503 : 200 });
  } catch (err) {
    console.error("Health check error:", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
