import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";

const timeRe = /^\d{2}:\d{2}(:\d{2})?$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;

const assignmentPayloadSchema = z.object({
  assignment_date: z.string().regex(dateRe),
  employee_id: z.string().uuid(),
  zone_id: z.string().uuid().nullable().optional(),
  start_time: z.string().regex(timeRe).nullable().optional(),
  end_time: z.string().regex(timeRe).nullable().optional(),
  color_hex: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  is_day_off: z.boolean().optional().default(false),
  notes: z.string().max(500).nullable().optional(),
});

const bulkSchema = z.object({
  assignments: z.array(assignmentPayloadSchema).min(1).max(200),
});

const patchSchema =assignmentPayloadSchema.partial().extend({
  id: z.string().uuid(),
});

export async function GET(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  const url = new URL(request.url);
  const day = url.searchParams.get("day");
  const month = url.searchParams.get("month");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const monthRe = /^\d{4}-\d{2}$/;
  if (day && !dateRe.test(day)) return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });
  if (month && !monthRe.test(month)) return NextResponse.json({ error: "Formato de mes inválido (YYYY-MM)" }, { status: 400 });
  if (from && !dateRe.test(from)) return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });
  if (to && !dateRe.test(to)) return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });

  let query = supabase
    .from("task_assignments")
    .select("*, employees(full_name), zones(name, color_hex)")
    .order("assignment_date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: false });

  if (day) {
    query = query.eq("assignment_date", day);
  } else if (month) {
    query = query.gte("assignment_date", `${month}-01`);
    const [y, m] = month.split("-").map(Number);
    const lastDate = new Date(Number(y), Number(m), 0).toISOString().slice(0, 10);
    query = query.lte("assignment_date", lastDate);
  } else if (from && to) {
    query = query.gte("assignment_date", from).lte("assignment_date", to);
  }

  const { data, error: dbError } = await query;
  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { supabase, error, userId } = await requireAdmin();
  if (error) return authErrorResponse(error);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("task_assignments")
    .insert(parsed.data.assignments.map((a) => ({ ...a, created_by: userId })))
    .select("*, employees(full_name), zones(name, color_hex)");

  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, ...updates } = parsed.data;

  const { data, error: dbError } = await supabase
    .from("task_assignments")
    .update(updates)
    .eq("id", id)
    .select("*, employees(full_name), zones(name, color_hex)")
    .single();

  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Falta el parámetro id o no es válido" }, { status: 400 });

  const { error: dbError } = await supabase
    .from("task_assignments")
    .delete()
    .eq("id", id);

  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data: { id } });
}
