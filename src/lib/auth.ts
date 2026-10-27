import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

/**
 * Verifica que la petición venga de un admin o superadmin activo.
 * Se usa en todas las rutas /api para no repetir la misma lógica.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, error: "No autenticado" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || (profile.role !== "admin" && profile.role !== "superadmin")) {
    return { supabase, error: "No autorizado" as const };
  }

  return { supabase, error: null, userId: user.id, role: profile.role as UserRole };
}

/** Respuesta estándar cuando requireAdmin falla (401 sin sesión, 403 sin permiso). */
export function authErrorResponse(error: "No autenticado" | "No autorizado") {
  return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
}
