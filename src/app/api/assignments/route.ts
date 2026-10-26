import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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

  return { supabase, error: null, userId: user.id };
}

export async function GET(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

  const url = new URL(request.url);
  const day = url.searchParams.get("day");
  const month = url.searchParams.get("month");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

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
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { supabase, error, userId } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

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

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
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

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });

  const { error: dbError } = await supabase
    .from("task_assignments")
    .delete()
    .eq("id", id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ data: { id } });
}
