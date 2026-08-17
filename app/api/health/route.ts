import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
      process.env.RATE_LIMIT_SECRET,
  );

  return NextResponse.json(
    { status: configured ? "ok" : "degraded" },
    {
      status: configured ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
