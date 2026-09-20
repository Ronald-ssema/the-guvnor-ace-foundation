import "server-only";

import { createHmac } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";

type RateLimitOptions = {
  scope: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult =
  | {
      status: "allowed" | "limited";
      remaining: number;
      resetAt: string;
    }
  | {
      status: "unavailable";
    };

export function getClientAddress(headers: Pick<Headers, "get">) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return headers.get("x-real-ip")?.trim() || forwardedFor || "unknown";
}

export async function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const secret = process.env.RATE_LIMIT_SECRET;

  if (!secret || secret.length < 32) {
    console.error("Rate limiting is unavailable: configuration is incomplete");
    return { status: "unavailable" };
  }

  const key = createHmac("sha256", secret)
    .update(`${scope}:${identifier}`)
    .digest("hex");

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("consume_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error || !Array.isArray(data) || data.length !== 1) {
      console.error("Rate limit storage request failed", {
        code: error?.code,
      });
      return { status: "unavailable" };
    }

    const row = data[0] as {
      allowed: boolean;
      remaining: number;
      reset_at: string;
    };

    return {
      status: row.allowed ? "allowed" : "limited",
      remaining: Math.max(0, row.remaining),
      resetAt: row.reset_at,
    };
  } catch {
    console.error("Rate limiting is unavailable");
    return { status: "unavailable" };
  }
}
