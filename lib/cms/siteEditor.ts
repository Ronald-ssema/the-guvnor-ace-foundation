import { createClient } from "@supabase/supabase-js";

export const editablePageKeys = [
  "donate",
  "programmes",
  "impact",
  "contact",
] as const;

export const homeSectionKeys = [
  "programmes",
  "principles",
  "impact",
  "story",
  "action",
] as const;

export type EditablePageKey = (typeof editablePageKeys)[number];
export type HomeSectionKey = (typeof homeSectionKeys)[number];
export type AccentPreset = "gold" | "emerald" | "blue";
export type LayoutDensity = "comfortable" | "compact";

export type EditablePageHero = {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type EditableHomeSection = {
  label: string;
  visible: boolean;
  order: number;
  kicker: string;
  title: string;
  body: string;
  imagePath: string | null;
  imageUrl: string | null;
  imageAlt: string;
  caption: string;
};

export type SiteEditorSettings = {
  contact: {
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    location: string;
  };
  donations: {
    paypal: string;
    goFundMe: string;
    airtelNumber: string;
    airtelAccountName: string;
  };
  appearance: {
    accent: AccentPreset;
    density: LayoutDensity;
  };
  pages: Record<EditablePageKey, EditablePageHero>;
  homeSections: Record<HomeSectionKey, EditableHomeSection>;
};

export const fallbackSiteEditorSettings: SiteEditorSettings = {
  contact: {
    email: "guvnorace@gmail.com",
    phoneDisplay: "+256 752 462 740",
    phoneHref: "+256752462740",
    location: "Bunamwaya–Lubowa, Entebbe Road, Wakiso District, Uganda.",
  },
  donations: {
    paypal: "https://www.paypal.com/donate/?hosted_button_id=BZ6ADS654NEBY",
    goFundMe: "https://gofund.me/a8c4e7499",
    airtelNumber: "+256 752 462 740",
    airtelAccountName: "Ssemawere Ronald",
  },
  appearance: { accent: "gold", density: "comfortable" },
  pages: {
    donate: {
      label: "Donation page",
      eyebrow: "Support our mission",
      title: "Help us give children food, education and hope.",
      description:
        "Donate securely in moments. Choose PayPal, GoFundMe or Airtel Money and your support can help fund practical programmes for vulnerable children and families in Uganda.",
      primaryLabel: "Donate securely with PayPal",
      primaryHref: "https://www.paypal.com/donate/?hosted_button_id=BZ6ADS654NEBY",
      secondaryLabel: "Donate on GoFundMe",
      secondaryHref: "https://gofund.me/a8c4e7499",
    },
    programmes: {
      label: "Programmes page",
      eyebrow: "Our programmes",
      title: "Practical support designed around real needs.",
      description:
        "Our programmes focus on food security, education, child protection and community support for vulnerable children and families in Uganda.",
      primaryLabel: "Support Our Work",
      primaryHref: "/donate",
      secondaryLabel: "Contact Our Team",
      secondaryHref: "/contact",
    },
    impact: {
      label: "Impact page",
      eyebrow: "Our impact",
      title: "Transparent action. Meaningful community change.",
      description:
        "Supporters deserve clear information about what we do, how assistance is delivered and how programme results are documented.",
      primaryLabel: "View Reports",
      primaryHref: "/reports",
      secondaryLabel: "Support Our Mission",
      secondaryHref: "/donate",
    },
    contact: {
      label: "Contact page",
      eyebrow: "Contact us",
      title: "We would be pleased to hear from you.",
      description:
        "Contact The Guvnor Ace Foundation about donations, volunteering, partnerships, programme enquiries or responsible community support.",
      primaryLabel: "Support Our Mission",
      primaryHref: "/donate",
      secondaryLabel: "Volunteer With Us",
      secondaryHref: "/volunteer",
    },
  },
  homeSections: {
    programmes: {
      label: "Programme highlights",
      visible: true,
      order: 1,
      kicker: "What we do",
      title: "Practical action. Meaningful change.",
      body: "Our programmes respond to real community needs while keeping dignity, safeguarding and accountability at the centre of every decision.",
      imagePath: null,
      imageUrl: null,
      imageAlt: "",
      caption: "",
    },
    principles: {
      label: "How we work",
      visible: true,
      order: 2,
      kicker: "How we work",
      title: "Trust must be earned.",
      body: "Strong charitable work requires more than good intentions. It requires responsible systems, safeguarding and accountability.",
      imagePath: null,
      imageUrl: null,
      imageAlt: "",
      caption: "",
    },
    impact: {
      label: "Impact and reporting",
      visible: true,
      order: 3,
      kicker: "Our impact",
      title: "Evidence before numbers.",
      body: "We are building a reporting system that prioritises verified information over impressive but unconfirmed figures.",
      imagePath: null,
      imageUrl: null,
      imageAlt: "",
      caption: "",
    },
    story: {
      label: "Safeguarding story",
      visible: true,
      order: 4,
      kicker: "Stories with dignity",
      title: "People are more than their hardship.",
      body: "We believe stories should demonstrate impact without exploiting the children and families at the centre of our work. Privacy, consent and safeguarding must always come first.",
      imagePath: null,
      imageUrl: null,
      imageAlt: "Children and families supported through community work",
      caption: "",
    },
    action: {
      label: "Final call to action",
      visible: true,
      order: 5,
      kicker: "Take action",
      title: "Help build a brighter future.",
      body: "",
      imagePath: null,
      imageUrl: null,
      imageAlt: "",
      caption: "",
    },
  },
};

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function textValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function orderValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5
    ? value
    : fallback;
}

export function parseSiteEditorSettings(value: unknown): SiteEditorSettings {
  const source = objectValue(value);
  const contact = objectValue(source.contact);
  const donations = objectValue(source.donations);
  const appearance = objectValue(source.appearance);
  const pages = objectValue(source.pages);
  const homeSections = objectValue(source.homeSections);

  const parsedPages = Object.fromEntries(
    editablePageKeys.map((key) => {
      const item = objectValue(pages[key]);
      const fallback = fallbackSiteEditorSettings.pages[key];
      return [
        key,
        {
          ...fallback,
          eyebrow: textValue(item.eyebrow, fallback.eyebrow),
          title: textValue(item.title, fallback.title),
          description: textValue(item.description, fallback.description),
          primaryLabel: textValue(item.primaryLabel, fallback.primaryLabel),
          primaryHref: textValue(item.primaryHref, fallback.primaryHref),
          secondaryLabel: textValue(item.secondaryLabel, fallback.secondaryLabel),
          secondaryHref: textValue(item.secondaryHref, fallback.secondaryHref),
        },
      ];
    }),
  ) as Record<EditablePageKey, EditablePageHero>;

  const parsedSections = Object.fromEntries(
    homeSectionKeys.map((key) => {
      const item = objectValue(homeSections[key]);
      const fallback = fallbackSiteEditorSettings.homeSections[key];
      return [
        key,
        {
          ...fallback,
          visible: booleanValue(item.visible, fallback.visible),
          order: orderValue(item.order, fallback.order),
          kicker: textValue(item.kicker, fallback.kicker),
          title: textValue(item.title, fallback.title),
          body: typeof item.body === "string" ? item.body.trim() : fallback.body,
          imagePath:
            typeof item.imagePath === "string" && item.imagePath.trim()
              ? item.imagePath.trim()
              : null,
          imageUrl: null,
          imageAlt: textValue(item.imageAlt, fallback.imageAlt),
          caption: typeof item.caption === "string" ? item.caption.trim() : fallback.caption,
        },
      ];
    }),
  ) as Record<HomeSectionKey, EditableHomeSection>;

  const accent = appearance.accent;
  const density = appearance.density;

  return {
    contact: {
      email: textValue(contact.email, fallbackSiteEditorSettings.contact.email),
      phoneDisplay: textValue(
        contact.phoneDisplay,
        fallbackSiteEditorSettings.contact.phoneDisplay,
      ),
      phoneHref: textValue(
        contact.phoneHref,
        fallbackSiteEditorSettings.contact.phoneHref,
      ),
      location: textValue(contact.location, fallbackSiteEditorSettings.contact.location),
    },
    donations: {
      paypal: textValue(donations.paypal, fallbackSiteEditorSettings.donations.paypal),
      goFundMe: textValue(
        donations.goFundMe,
        fallbackSiteEditorSettings.donations.goFundMe,
      ),
      airtelNumber: textValue(
        donations.airtelNumber,
        fallbackSiteEditorSettings.donations.airtelNumber,
      ),
      airtelAccountName: textValue(
        donations.airtelAccountName,
        fallbackSiteEditorSettings.donations.airtelAccountName,
      ),
    },
    appearance: {
      accent:
        accent === "emerald" || accent === "blue" || accent === "gold"
          ? accent
          : fallbackSiteEditorSettings.appearance.accent,
      density:
        density === "compact" || density === "comfortable"
          ? density
          : fallbackSiteEditorSettings.appearance.density,
    },
    pages: parsedPages,
    homeSections: parsedSections,
  };
}

export async function getSiteEditorSettings(): Promise<SiteEditorSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return fallbackSiteEditorSettings;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("setting_key", "visual_editor")
      .eq("is_public", true)
      .maybeSingle();

    if (error || !data) return fallbackSiteEditorSettings;

    const settings = parseSiteEditorSettings(data.value);
    const story = settings.homeSections.story;

    if (story.imagePath) {
      const { data: media } = await supabase
        .from("media_assets")
        .select("storage_path")
        .eq("storage_path", story.imagePath)
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .not("safeguarding_reviewed_at", "is", null)
        .maybeSingle();

      if (media) {
        const { data: signed } = await supabase.storage
          .from("site-media")
          .createSignedUrl(story.imagePath, 3600);
        story.imageUrl = signed?.signedUrl ?? null;
      }
    }

    return settings;
  } catch {
    return fallbackSiteEditorSettings;
  }
}

export function isExternalHref(href: string) {
  return href.startsWith("https://") || href.startsWith("http://");
}
