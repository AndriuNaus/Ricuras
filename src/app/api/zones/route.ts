import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const zoneSchema = z.object({
  name: z.string().min(2).max(80),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#C86D3B"),
  description: z.string().max(200).optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "No autenticado" as const };
  const { data: profile } = await supabase.from("profiles").select("role,is_active").eq("id", user.id).single();
  if (!profile || !profile.is_active || (profile.role !== "admin" && profile.role !== "superadmin")) {
    return { supabase, error: "No autorizado" as const };
  }
  return { supabase, error: null, userId: user.id };
}

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  const { data, error: dbError } = await supabase.from("zones").select("*").order("sort_order", { ascending: true });
  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const parsed = zoneSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  const { data, error: dbError } = await supabase.from("zones").insert(parsed.data).select().single();
  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }
  return NextResponse.json({ data }, { status: 201 });
}
