const isDevelopment = process.env.NODE_ENV === "development";

function getSupabaseOrigin() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && !isDevelopment) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function buildContentSecurityPolicy(
  nonce: string,
  upgradeInsecureRequests = !isDevelopment,
) {
  const supabaseOrigin = getSupabaseOrigin();
  const connectSources = ["'self'", supabaseOrigin].filter(Boolean).join(" ");
  const assetSources = ["'self'", supabaseOrigin].filter(Boolean).join(" ");

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    // next/image uses inline style attributes for intrinsic image layout.
    "style-src-attr 'unsafe-inline'",
    `img-src ${assetSources} blob: data:`,
    "font-src 'self'",
    `connect-src ${connectSources}`,
    `media-src ${assetSources}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(upgradeInsecureRequests ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
