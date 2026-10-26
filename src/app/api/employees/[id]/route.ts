import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateEmployeeSchema = z.object({
  full_name: z.string().min(2).max(120).optional(),
  phone: z.string().max(40).optional().nullable(),
  document_id: z.string().max(40).optional().nullable(),
  position: z.string().min(2).max(80).optional(),
  photo_url: z.string().url().optional().nullable(),
  is_active: z.boolean().optional(),
  status: z.enum(["activo", "suspendido", "vacaciones"]).optional(),
});

async function requireAdmin() {
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

  return { supabase, error: null, role: profile.role };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, error } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

  const { data, error: dbError } = await supabase
    .from("employees")
    .select("*")
    .eq("id", params.id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, error } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parsed = updateEmployeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("employees")
    .update(parsed.data)
    .eq("id", params.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, error, role } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

  // Eliminación definitiva solo superadmin: /api/employees/[id]?hard=true
  const url = new URL(request.url);
  if (url.searchParams.get("hard") === "true") {
    if (role !== "superadmin") {
      return NextResponse.json(
        { error: "Solo un superadministrador puede eliminar operarios definitivamente" },
        { status: 403 }
      );
    }

    const { error: dbError } = await supabase
      .from("employees")
      .delete()
      .eq("id", params.id);

    if (dbError) {
      return NextResponse.json(
        {
          error:
            dbError.code === "23503"
              ? "No se puede eliminar: tiene marcaciones o tareas registradas. Usa Desactivar en su lugar."
              : dbError.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ data: { id: params.id, deleted: true } });
  }

  // Desactivación (soft): conserva el historial
  const { data, error: dbError } = await supabase
    .from("employees")
    .update({ is_active: false })
    .eq("id", params.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
