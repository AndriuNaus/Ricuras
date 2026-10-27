import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";

const createEmployeeSchema = z.object({
  full_name: z.string().min(2).max(120),
  phone: z.string().max(40).optional().nullable(),
  document_id: z.string().max(40).optional().nullable(),
  position: z.string().min(2).max(80).optional(),
  photo_url: z.string().url().optional().nullable(),
  is_active: z.boolean().optional(),
});

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  const { data, error: dbError } = await supabase
    .from("employees")
    .select("*")
    .order("full_name", { ascending: true });

  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parsed = createEmployeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("employees")
    .insert(parsed.data)
    .select()
    .single();

  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
