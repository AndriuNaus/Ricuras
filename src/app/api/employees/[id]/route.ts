import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";

const updateEmployeeSchema = z.object({
  full_name: z.string().min(2).max(120).optional(),
  phone: z.string().max(40).optional().nullable(),
  document_id: z.string().max(40).optional().nullable(),
  position: z.string().min(2).max(80).optional(),
  photo_url: z.string().url().optional().nullable(),
  is_active: z.boolean().optional(),
  status: z.enum(["activo", "suspendido", "vacaciones"]).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  const { data, error: dbError } = await supabase
    .from("employees")
    .select("*")
    .eq("id", params.id)
    .single();

  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Recurso no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

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
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, error, role } = await requireAdmin();
  if (error) return authErrorResponse(error);

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
              : "Error interno del servidor.",
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
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }

  return NextResponse.json({ data });
}
