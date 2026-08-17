import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type RateLimitOptions = {
  scope: string;
  subject: string;
  limit: number;
  windowSeconds: number;
};

export function clientAddress(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function consumeRateLimit({
  scope,
  subject,
  limit,
  windowSeconds,
}: RateLimitOptions) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secret = process.env.RATE_LIMIT_SECRET;

  if (!url || !key || !secret) {
    console.error("Rate limiting is not configured.");
    return false;
  }

  const keyHash = createHmac("sha256", secret)
    .update(`${scope}:${subject}`)
    .digest("hex");

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error("Rate limit check failed.");
    return false;
  }

  return data === true;
}
