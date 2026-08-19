import { createClient } from "@supabase/supabase-js";

export const websiteImageSlotKeys = [
  "about",
  "food",
  "education",
  "childOne",
  "childTwo",
  "donate",
] as const;

export type WebsiteImageSlotKey = (typeof websiteImageSlotKeys)[number];

export const pageGalleryKeys = [
  "home",
  "about",
  "programmes",
  "impact",
  "stories",
  "getInvolved",
  "volunteer",
  "partnerships",
  "donate",
  "contact",
] as const;

export type PageGalleryKey = (typeof pageGalleryKeys)[number];

export const pageGalleryDetails: Record<
  PageGalleryKey,
  { label: string; path: string; defaultTitle: string }
> = {
  home: { label: "Homepage", path: "/", defaultTitle: "Our work in pictures" },
  about: { label: "About us", path: "/about", defaultTitle: "Our Foundation in pictures" },
  programmes: { label: "Programmes", path: "/programmes", defaultTitle: "Our programmes in action" },
  impact: { label: "Impact", path: "/impact", defaultTitle: "Our impact in pictures" },
  stories: { label: "Stories", path: "/stories", defaultTitle: "Our work in pictures" },
  getInvolved: { label: "Get involved", path: "/get-involved", defaultTitle: "Get involved with our work" },
  volunteer: { label: "Volunteer", path: "/volunteer", defaultTitle: "Volunteering in pictures" },
  partnerships: { label: "Partnerships", path: "/partnerships", defaultTitle: "Working together" },
  donate: { label: "Donate", path: "/donate", defaultTitle: "Your support in action" },
  contact: { label: "Contact", path: "/contact", defaultTitle: "Our community" },
};

export type WebsiteImageSlot = {
  mediaPath: string | null;
  visible: boolean;
  alt: string;
};

export type WebsiteImageSettings = {
  slots: Record<WebsiteImageSlotKey, WebsiteImageSlot>;
  pageGalleries: Record<PageGalleryKey, {
    visible: boolean;
    title: string;
    mediaPaths: string[];
  }>;
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
  pageGalleries: Record<PageGalleryKey, {
    visible: boolean;
    title: string;
    images: ResolvedGalleryImage[];
  }>;
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
  donate: {
    label: "Donation page impact photograph",
    usedOn: "Donation page hero",
    fallbackSrc: "/images/donate-impact.jpg",
    fallbackAlt: "Children receiving a freshly prepared meal during a community food programme in Uganda",
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
  pageGalleries: Object.fromEntries(
    pageGalleryKeys.map((key) => [
      key,
      { visible: true, title: pageGalleryDetails[key].defaultTitle, mediaPaths: [] },
    ]),
  ) as unknown as WebsiteImageSettings["pageGalleries"],
};

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

export function parseWebsiteImageSettings(value: unknown): WebsiteImageSettings {
  const source = objectValue(value);
  const slots = objectValue(source.slots);
  const pageGalleries = objectValue(source.pageGalleries);
  const legacyStoriesGallery = objectValue(source.gallery);

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
    pageGalleries: Object.fromEntries(
      pageGalleryKeys.map((key) => {
        const configured = objectValue(pageGalleries[key]);
        const gallery = key === "stories" && !Object.keys(configured).length
          ? legacyStoriesGallery
          : configured;
        const fallback = fallbackWebsiteImageSettings.pageGalleries[key];
        return [
          key,
          {
            visible: typeof gallery.visible === "boolean" ? gallery.visible : fallback.visible,
            title:
              typeof gallery.title === "string" && gallery.title.trim()
                ? gallery.title.trim()
                : fallback.title,
            mediaPaths: Array.isArray(gallery.mediaPaths)
              ? [...new Set(gallery.mediaPaths.filter(
                  (item): item is string => typeof item === "string" && Boolean(item.trim()),
                ))].slice(0, 24)
              : [],
          },
        ];
      }),
    ) as WebsiteImageSettings["pageGalleries"],
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
    pageGalleries: Object.fromEntries(
      pageGalleryKeys.map((key) => [
        key,
        {
          visible: fallbackWebsiteImageSettings.pageGalleries[key].visible,
          title: fallbackWebsiteImageSettings.pageGalleries[key].title,
          images: [],
        },
      ]),
    ) as unknown as ResolvedWebsiteImages["pageGalleries"],
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
      ...pageGalleryKeys.flatMap((key) => settings.pageGalleries[key].mediaPaths),
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
      pageGalleries: Object.fromEntries(
        pageGalleryKeys.map((key) => {
          const gallery = settings.pageGalleries[key];
          return [
            key,
            {
              visible: gallery.visible,
              title: gallery.title,
              images: gallery.mediaPaths.flatMap((mediaPath) => {
                const media = mediaByPath.get(mediaPath);
                const src = signedByPath.get(mediaPath);
                return media && src
                  ? [{ mediaPath, src, alt: media.alt_text, caption: media.caption }]
                  : [];
              }),
            },
          ];
        }),
      ) as ResolvedWebsiteImages["pageGalleries"],
    };
  } catch {
    return fallbackResolved();
  }
}
