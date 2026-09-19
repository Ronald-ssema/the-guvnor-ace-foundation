import { createClient } from "@supabase/supabase-js";

export type HomeHeroContent = {
  kicker: string;
  title: string;
  description: string;
  imagePath: string | null;
  imageUrl: string | null;
  imageAlt: string;
};

export const fallbackHomeHero: HomeHeroContent = {
  kicker: "Empowering children. Strengthening communities.",
  title: "Building brighter futures for children and families.",
  description:
    "The Guvnor Ace Foundation supports vulnerable children, families and communities in Uganda through food support, education, safeguarding, healthcare and practical community-led programmes.",
  imagePath: null,
  imageUrl: null,
  imageAlt: "Children supported by The Guvnor Ace Foundation",
};

type SiteContentRow = {
  title: string | null;
  body: string | null;
  content: unknown;
};

function textValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export async function getHomeHeroContent(): Promise<HomeHeroContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return fallbackHomeHero;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from("site_content")
      .select("title, body, content")
      .eq("page_slug", "home")
      .eq("section_key", "hero")
      .eq("is_published", true)
      .maybeSingle<SiteContentRow>();

    if (error || !data) return fallbackHomeHero;

    const content =
      data.content && typeof data.content === "object"
        ? (data.content as Record<string, unknown>)
        : {};

    const imagePath =
      typeof content.imagePath === "string" && content.imagePath.trim()
        ? content.imagePath.trim()
        : null;
    let imageUrl: string | null = null;

    if (imagePath) {
      const { data: media } = await supabase
        .from("media_assets")
        .select("storage_path")
        .eq("storage_path", imagePath)
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .not("safeguarding_reviewed_at", "is", null)
        .maybeSingle();

      if (media) {
        const { data: signed } = await supabase.storage
          .from("site-media")
          .createSignedUrl(imagePath, 3600);
        imageUrl = signed?.signedUrl ?? null;
      }
    }

    return {
      kicker: textValue(content.kicker, fallbackHomeHero.kicker),
      title: textValue(data.title, fallbackHomeHero.title),
      description: textValue(data.body, fallbackHomeHero.description),
      imagePath,
      imageUrl,
      imageAlt: textValue(content.imageAlt, fallbackHomeHero.imageAlt),
    };
  } catch {
    return fallbackHomeHero;
  }
}
