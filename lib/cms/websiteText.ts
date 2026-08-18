import { createClient } from "@supabase/supabase-js";

export const editableWebsitePages = [
  { path: "/", label: "Homepage" },
  { path: "/about", label: "About us" },
  { path: "/programmes", label: "Programmes" },
  { path: "/impact", label: "Impact" },
  { path: "/stories", label: "Stories" },
  { path: "/get-involved", label: "Get involved" },
  { path: "/volunteer", label: "Volunteer" },
  { path: "/partnerships", label: "Partnerships" },
  { path: "/donate", label: "Donate" },
  { path: "/contact", label: "Contact" },
  { path: "/reports", label: "Reports" },
  { path: "/safeguarding", label: "Safeguarding" },
  { path: "/child-protection", label: "Child protection" },
  { path: "/policies", label: "Policies" },
  { path: "/complaints", label: "Complaints" },
  { path: "/donation-refund", label: "Donation refunds" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/cookies", label: "Cookies" },
  { path: "/accessibility", label: "Accessibility" },
] as const;

export type WebsiteTextSettings = {
  global: Record<string, string>;
  pages: Record<string, Record<string, string>>;
};

export const fallbackWebsiteTextSettings: WebsiteTextSettings = {
  global: {},
  pages: {},
};

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function textMap(value: unknown): Record<string, string> {
  return Object.fromEntries(
    Object.entries(objectValue(value)).filter(
      (entry): entry is [string, string] =>
        /^[a-z-]+:[a-f0-9]{8}:\d+$/.test(entry[0]) &&
        typeof entry[1] === "string" &&
        entry[1].length <= 2000,
    ),
  );
}

export function parseWebsiteTextSettings(value: unknown): WebsiteTextSettings {
  const source = objectValue(value);
  const pages = objectValue(source.pages);

  return {
    global: textMap(source.global),
    pages: Object.fromEntries(
      editableWebsitePages.map(({ path }) => [path, textMap(pages[path])]),
    ),
  };
}

export async function getWebsiteTextSettings(): Promise<WebsiteTextSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return fallbackWebsiteTextSettings;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("setting_key", "website_text")
      .eq("is_public", true)
      .maybeSingle();

    return error ? fallbackWebsiteTextSettings : parseWebsiteTextSettings(data?.value);
  } catch {
    return fallbackWebsiteTextSettings;
  }
}
