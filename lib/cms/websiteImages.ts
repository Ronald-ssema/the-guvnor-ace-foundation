import { createClient } from "@supabase/supabase-js";

export const websiteImageSlotKeys = [
  "about",
  "food",
  "education",
  "childOne",
  "childTwo",
] as const;

export type WebsiteImageSlotKey = (typeof websiteImageSlotKeys)[number];

export type WebsiteImageSlot = {
  mediaPath: string | null;
  visible: boolean;
  alt: string;
};

export type WebsiteImageSettings = {
  slots: Record<WebsiteImageSlotKey, WebsiteImageSlot>;
  gallery: {
    visible: boolean;
    title: string;
    mediaPaths: string[];
  };
};

export type ResolvedWebsiteImage = WebsiteImageSlot & {
  src: string;
};

export type ResolvedGalleryImage = {
  mediaPath: string;
  src: string;
  alt: string;
  caption: string | null;
};

export type ResolvedWebsiteImages = {
  slots: Record<WebsiteImageSlotKey, ResolvedWebsiteImage>;
  gallery: {
    visible: boolean;
    title: string;
    images: ResolvedGalleryImage[];
  };
};

export const websiteImageSlotDetails: Record<
  WebsiteImageSlotKey,
  { label: string; usedOn: string; fallbackSrc: string; fallbackAlt: string }
> = {
  about: {
    label: "Foundation and community photograph",
    usedOn: "Homepage About section and Community Outreach programme",
    fallbackSrc: "/images/about.jpg",
    fallbackAlt: "Children and community members supported by The Guvnor Ace Foundation",
  },
  food: {
    label: "Food and nutrition photograph",
    usedOn: "Homepage programmes, Programmes page and Stories page",
    fallbackSrc: "/images/food-drive.jpg",
    fallbackAlt: "Food and nutrition support delivered in the community",
  },
  education: {
    label: "Education photograph",
    usedOn: "Homepage programmes, Programmes page and Stories page",
    fallbackSrc: "/images/education.jpg",
    fallbackAlt: "Education support for children in Uganda",
  },
  childOne: {
    label: "Children and families photograph",
    usedOn: "Homepage programmes and Stories page",
    fallbackSrc: "/images/child-1.jpg",
    fallbackAlt: "Children and families supported through community work",
  },
  childTwo: {
    label: "Impact photograph",
    usedOn: "Impact page and Stories page",
    fallbackSrc: "/images/child-2.jpg",
    fallbackAlt: "Children participating in a community programme in Uganda",
  },
};

export const fallbackWebsiteImageSettings: WebsiteImageSettings = {
  slots: Object.fromEntries(
    websiteImageSlotKeys.map((key) => [
      key,
      {
        mediaPath: null,
        visible: true,
        alt: websiteImageSlotDetails[key].fallbackAlt,
      },
    ]),
  ) as Record<WebsiteImageSlotKey, WebsiteImageSlot>,
  gallery: {
    visible: true,
    title: "Our work in pictures",
    mediaPaths: [],
  },
};

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

export function parseWebsiteImageSettings(value: unknown): WebsiteImageSettings {
  const source = objectValue(value);
  const slots = objectValue(source.slots);
  const gallery = objectValue(source.gallery);

  return {
    slots: Object.fromEntries(
      websiteImageSlotKeys.map((key) => {
        const item = objectValue(slots[key]);
        const fallback = fallbackWebsiteImageSettings.slots[key];
        return [
          key,
          {
            mediaPath:
              typeof item.mediaPath === "string" && item.mediaPath.trim()
                ? item.mediaPath.trim()
                : null,
            visible: typeof item.visible === "boolean" ? item.visible : fallback.visible,
            alt:
              typeof item.alt === "string" && item.alt.trim()
                ? item.alt.trim()
                : fallback.alt,
          },
        ];
      }),
    ) as Record<WebsiteImageSlotKey, WebsiteImageSlot>,
    gallery: {
      visible: typeof gallery.visible === "boolean" ? gallery.visible : true,
      title:
        typeof gallery.title === "string" && gallery.title.trim()
          ? gallery.title.trim()
          : fallbackWebsiteImageSettings.gallery.title,
      mediaPaths: Array.isArray(gallery.mediaPaths)
        ? [...new Set(gallery.mediaPaths.filter((item): item is string => typeof item === "string" && Boolean(item.trim())))]
            .slice(0, 24)
        : [],
    },
  };
}

export async function getWebsiteImageSettings(): Promise<ResolvedWebsiteImages> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const fallbackResolved = (): ResolvedWebsiteImages => ({
    slots: Object.fromEntries(
      websiteImageSlotKeys.map((slotKey) => [
        slotKey,
        {
          ...fallbackWebsiteImageSettings.slots[slotKey],
          src: websiteImageSlotDetails[slotKey].fallbackSrc,
        },
      ]),
    ) as Record<WebsiteImageSlotKey, ResolvedWebsiteImage>,
    gallery: { visible: true, title: fallbackWebsiteImageSettings.gallery.title, images: [] },
  });

  if (!url || !key) return fallbackResolved();

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("setting_key", "website_images")
      .eq("is_public", true)
      .maybeSingle();

    const settings = parseWebsiteImageSettings(data?.value);
    const mediaPaths = [
      ...websiteImageSlotKeys.map((slotKey) => settings.slots[slotKey].mediaPath),
      ...settings.gallery.mediaPaths,
    ].filter((item): item is string => Boolean(item));

    const mediaByPath = new Map<string, { alt_text: string; caption: string | null }>();
    const signedByPath = new Map<string, string>();

    if (mediaPaths.length) {
      const { data: media } = await supabase
        .from("media_assets")
        .select("storage_path, alt_text, caption")
        .in("storage_path", [...new Set(mediaPaths)])
        .eq("media_kind", "image")
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .not("safeguarding_reviewed_at", "is", null);

      await Promise.all(
        (media ?? []).map(async (item) => {
          mediaByPath.set(item.storage_path, item);
          const { data: signed } = await supabase.storage
            .from("site-media")
            .createSignedUrl(item.storage_path, 3600);
          if (signed?.signedUrl) signedByPath.set(item.storage_path, signed.signedUrl);
        }),
      );
    }

    return {
      slots: Object.fromEntries(
        websiteImageSlotKeys.map((slotKey) => {
          const slot = settings.slots[slotKey];
          const signedUrl = slot.mediaPath ? signedByPath.get(slot.mediaPath) : null;
          return [
            slotKey,
            {
              ...slot,
              src: signedUrl ?? websiteImageSlotDetails[slotKey].fallbackSrc,
            },
          ];
        }),
      ) as Record<WebsiteImageSlotKey, ResolvedWebsiteImage>,
      gallery: {
        visible: settings.gallery.visible,
        title: settings.gallery.title,
        images: settings.gallery.mediaPaths.flatMap((mediaPath) => {
          const media = mediaByPath.get(mediaPath);
          const src = signedByPath.get(mediaPath);
          return media && src ? [{ mediaPath, src, alt: media.alt_text, caption: media.caption }] : [];
        }),
      },
    };
  } catch {
    return fallbackResolved();
  }
}
