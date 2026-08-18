"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin/auth";
import {
  editablePageKeys,
  fallbackSiteEditorSettings,
  homeSectionKeys,
  type AccentPreset,
  type LayoutDensity,
  type SiteEditorSettings,
} from "@/lib/cms/siteEditor";

export type ContentActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function field(
  formData: FormData,
  name: string,
  maxLength: number,
  required = true,
) {
  const value = String(formData.get(name) ?? "").trim();

  if (required && !value) throw new Error(`${name} is required.`);
  if (value.length > maxLength) {
    throw new Error(`${name} must be ${maxLength} characters or fewer.`);
  }

  return value;
}

function safeHref(formData: FormData, name: string, required = true) {
  const value = field(formData, name, 500, required);
  if (!value) return value;

  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    if (url.protocol === "https:") return url.toString();
  } catch {
    // The validation error below is deliberately generic.
  }

  throw new Error(`${name} must be a secure https:// link or a website path beginning with /.`);
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export async function updateHomeHero(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await getAdminContext();

  if (!admin) {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }

  try {
    const kicker = field(formData, "kicker", 100);
    const title = field(formData, "title", 120);
    const description = field(formData, "description", 520);
    const imagePath = field(formData, "imagePath", 500, false) || null;
    const imageAlt = field(formData, "imageAlt", 180);

    if (imagePath) {
      const { data: media } = await admin.supabase
        .from("media_assets")
        .select("storage_path")
        .eq("storage_path", imagePath)
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .not("safeguarding_reviewed_at", "is", null)
        .maybeSingle();

      if (!media) {
        return {
          status: "error",
          message: "Choose a published image from the media library.",
        };
      }
    }

    const { data, error } = await admin.supabase
      .from("site_content")
      .upsert(
        {
          page_slug: "home",
          section_key: "hero",
          title,
          body: description,
          content: { kicker, imagePath, imageAlt },
          is_published: true,
          updated_by: admin.userId,
        },
        { onConflict: "page_slug,section_key" },
      )
      .select("id")
      .single();

    if (error) throw error;

    await admin.supabase.from("admin_audit_log").insert({
      actor_id: admin.userId,
      action: "update",
      entity_type: "site_content",
      entity_id: data.id,
      details: { page_slug: "home", section_key: "hero" },
    });

    revalidatePath("/");
    revalidatePath("/admin/content");

    return { status: "success", message: "Homepage content saved and published." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to save the content.",
    };
  }
}

export async function updateVisualEditor(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await getAdminContext();

  if (!admin) {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }

  try {
    const email = field(formData, "contact_email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid public contact email address.");
    }

    const accentValue = field(formData, "appearance_accent", 20) as AccentPreset;
    const densityValue = field(
      formData,
      "appearance_density",
      20,
    ) as LayoutDensity;
    if (!["gold", "emerald", "blue"].includes(accentValue)) {
      throw new Error("Choose one of the approved colour themes.");
    }
    if (!["comfortable", "compact"].includes(densityValue)) {
      throw new Error("Choose an approved layout spacing option.");
    }

    const pages = Object.fromEntries(
      editablePageKeys.map((key) => [
        key,
        {
          label: fallbackSiteEditorSettings.pages[key].label,
          eyebrow: field(formData, `${key}_eyebrow`, 80),
          title: field(formData, `${key}_title`, 140),
          description: field(formData, `${key}_description`, 520),
          primaryLabel: field(formData, `${key}_primaryLabel`, 80),
          primaryHref: safeHref(formData, `${key}_primaryHref`),
          secondaryLabel: field(formData, `${key}_secondaryLabel`, 80),
          secondaryHref: safeHref(formData, `${key}_secondaryHref`),
        },
      ]),
    ) as SiteEditorSettings["pages"];

    const homeSections = Object.fromEntries(
      homeSectionKeys.map((key) => {
        const order = Number(field(formData, `${key}_order`, 1));
        if (!Number.isInteger(order) || order < 1 || order > 5) {
          throw new Error("Section positions must be between 1 and 5.");
        }

        return [
          key,
          {
            label: fallbackSiteEditorSettings.homeSections[key].label,
            visible: checked(formData, `${key}_visible`),
            order,
            kicker: field(formData, `${key}_kicker`, 80),
            title: field(formData, `${key}_title`, 140),
            body: field(
              formData,
              `${key}_body`,
              700,
              key === "action" ? false : true,
            ),
            imagePath:
              key === "story"
                ? field(formData, "story_imagePath", 500, false) || null
                : null,
            imageUrl: null,
            imageAlt:
              key === "story"
                ? field(formData, "story_imageAlt", 180)
                : "",
            caption:
              key === "story"
                ? field(formData, "story_caption", 240, false)
                : "",
          },
        ];
      }),
    ) as SiteEditorSettings["homeSections"];

    const orders = homeSectionKeys.map((key) => homeSections[key].order);
    if (new Set(orders).size !== orders.length) {
      throw new Error("Give every homepage section a different position.");
    }

    if (homeSections.story.imagePath) {
      const { data: media } = await admin.supabase
        .from("media_assets")
        .select("storage_path")
        .eq("storage_path", homeSections.story.imagePath)
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .not("safeguarding_reviewed_at", "is", null)
        .maybeSingle();

      if (!media) {
        throw new Error("Choose a published, consent-confirmed image from the media library.");
      }
    }

    const phoneHref = field(formData, "contact_phoneHref", 40);
    if (!/^\+?[0-9\s()-]{7,40}$/.test(phoneHref)) {
      throw new Error("Enter a valid international telephone link.");
    }

    const value: SiteEditorSettings = {
      contact: {
        email,
        phoneDisplay: field(formData, "contact_phoneDisplay", 60),
        phoneHref,
        location: field(formData, "contact_location", 220),
      },
      donations: {
        paypal: safeHref(formData, "donations_paypal"),
        goFundMe: safeHref(formData, "donations_goFundMe"),
        airtelNumber: field(formData, "donations_airtelNumber", 60),
        airtelAccountName: field(formData, "donations_airtelAccountName", 120),
      },
      appearance: { accent: accentValue, density: densityValue },
      pages,
      homeSections,
    };

    const { data, error } = await admin.supabase
      .from("site_settings")
      .upsert(
        {
          setting_key: "visual_editor",
          label: "Safe visual website editor",
          value,
          is_public: true,
          updated_by: admin.userId,
        },
        { onConflict: "setting_key" },
      )
      .select("id")
      .single();

    if (error) throw error;

    await admin.supabase.from("admin_audit_log").insert({
      actor_id: admin.userId,
      action: "update",
      entity_type: "site_settings",
      entity_id: data.id,
      details: { setting_key: "visual_editor", controlled_fields: true },
    });

    for (const path of [
      "/",
      "/donate",
      "/programmes",
      "/impact",
      "/contact",
      "/admin/content",
    ]) {
      revalidatePath(path);
    }

    return {
      status: "success",
      message: "Website settings saved and published safely.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to save the website settings.",
    };
  }
}
