import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";

const BUCKET = "attendance-photos";

/**
 * GET /api/attendance/foto?path=attendance/xxx.jpg
 * Las selfies están en un bucket PRIVADO (protección de datos, LOPDP).
 * Solo un admin puede verlas: se genera un link firmado que caduca en 5 minutos
 * y se redirige a él, así la foto nunca tiene una URL pública permanente.
 */
export async function GET(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  const path = new URL(request.url).searchParams.get("path");
  if (!path || !/^attendance\/[\w.-]+$/.test(path)) {
    return NextResponse.json({ error: "Ruta de foto inválida" }, { status: 400 });
  }

  const { data, error: storageError } = await supabase.storage.from(BUCKET).createSignedUrl(path, 300);
  if (storageError || !data) {
    console.error("Storage error:", storageError);
    return NextResponse.json({ error: "Foto no encontrada." }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
