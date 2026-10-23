import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    return NextResponse.json({
      ok: !error,
      env: {
        hasUrl: Boolean(url),
        hasKey: Boolean(key),
        url,
      },
      error: error ? { message: error.message, code: error.code, details: error.details, hint: error.hint } : null,
      count,
      data,
    }, { status: error ? 500 : 200 });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        env: { hasUrl: Boolean(url), hasKey: Boolean(key), url },
        error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
      },
      { status: 500 }
    );
  }
}
