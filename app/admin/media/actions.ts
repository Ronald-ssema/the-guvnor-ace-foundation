"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { getAdminContext } from "@/lib/admin/auth";
import { containsStoragePath } from "@/lib/admin/mediaReferences";
import { fallbackHomeHero } from "@/lib/cms/home";
import { parseSiteEditorSettings } from "@/lib/cms/siteEditor";
import {
  parseWebsiteImageSettings,
  websiteImageSlotKeys,
  type WebsiteImageSlotKey,
  type WebsiteImageSettings,
} from "@/lib/cms/websiteImages";

export type MediaActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export type QuickImageTarget = "hero" | "story" | WebsiteImageSlotKey;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MEDIA_REVALIDATION_PATHS = [
  "/",
  "/admin/content",
  "/admin/media",
  "/stories",
  "/programmes",
  "/impact",
  "/reports",
];

function hasValidSignature(bytes: Uint8Array, mime: string) {
  if (mime === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === "image/png") {
    return bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index]);
  }
  if (mime === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

async function processImage(file: File) {
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Use a JPG, PNG or WebP image no larger than 5 MB.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type)) {
    throw new Error("The file content does not match its image type.");
  }

  try {
    return await sharp(bytes, { failOn: "warning" })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();
  } catch {
    throw new Error("The image could not be safely processed.");
  }
}

function revalidateMediaPages() {
  for (const path of MEDIA_REVALIDATION_PATHS) revalidatePath(path);
}

function isQuickImageTarget(value: string): value is QuickImageTarget {
  return value === "hero" || value === "story" || websiteImageSlotKeys.includes(value as WebsiteImageSlotKey);
}

async function assignUploadedImage(
  admin: NonNullable<Awaited<ReturnType<typeof getAdminContext>>>,
  target: QuickImageTarget,
  storagePath: string,
  altText: string,
) {
  if (target === "hero") {
    const { data: storedHero } = await admin.supabase
      .from("site_content")
      .select("title, body, content")
      .eq("page_slug", "home")
      .eq("section_key", "hero")
      .maybeSingle();
    const content =
      storedHero?.content && typeof storedHero.content === "object"
        ? (storedHero.content as Record<string, unknown>)
        : {};
    const { error } = await admin.supabase.from("site_content").upsert(
      {
        page_slug: "home",
        section_key: "hero",
        title: storedHero?.title || fallbackHomeHero.title,
        body: storedHero?.body || fallbackHomeHero.description,
        content: {
          ...content,
          kicker: typeof content.kicker === "string" ? content.kicker : fallbackHomeHero.kicker,
          imagePath: storagePath,
          imageAlt: altText,
        },
        is_published: true,
        updated_by: admin.userId,
      },
      { onConflict: "page_slug,section_key" },
    );
    if (error) throw error;
    return;
  }

  if (target === "story") {
    const { data: storedEditor } = await admin.supabase
      .from("site_settings")
      .select("value")
      .eq("setting_key", "visual_editor")
      .maybeSingle();
    const editor = parseSiteEditorSettings(storedEditor?.value);
    editor.homeSections.story.imagePath = storagePath;
    editor.homeSections.story.imageUrl = null;
    editor.homeSections.story.imageAlt = altText;
    const { error } = await admin.supabase.from("site_settings").upsert(
      {
        setting_key: "visual_editor",
        label: "Safe visual website editor",
        value: editor,
        is_public: true,
        updated_by: admin.userId,
      },
      { onConflict: "setting_key" },
    );
    if (error) throw error;
    return;
  }

  const { data: storedImages } = await admin.supabase
    .from("site_settings")
    .select("value")
    .eq("setting_key", "website_images")
    .maybeSingle();
  const settings = parseWebsiteImageSettings(storedImages?.value);
  settings.slots[target] = {
    mediaPath: storagePath,
    visible: true,
    alt: altText,
  };
  const { error } = await admin.supabase.from("site_settings").upsert(
    {
      setting_key: "website_images",
      label: "Website image placements and gallery",
      value: settings,
      is_public: true,
      updated_by: admin.userId,
    },
    { onConflict: "setting_key" },
  );
  if (error) throw error;
}

export async function quickReplaceWebsiteImage(
  targetValue: string,
  _previousState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const admin = await getAdminContext();
  if (!admin) return { status: "error", message: "Your session has expired. Sign in again." };
  if (!isQuickImageTarget(targetValue)) {
    return { status: "error", message: "This website image position is not valid." };
  }

  const file = formData.get("quickFile");
  const altText = String(formData.get("quickAltText") ?? "").trim();
  const consentConfirmed = formData.get("quickConsent") === "on";
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose the replacement photograph." };
  }
  if (!altText || altText.length > 180) {
    return { status: "error", message: "Add an image description of no more than 180 characters." };
  }
  if (!consentConfirmed) {
    return { status: "error", message: "Confirm that the Foundation has permission to use this photograph." };
  }

  let safeImage: Buffer;
  try {
    safeImage = await processImage(file);
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "The image could not be processed." };
  }

  const storagePath = `images/${new Date().getUTCFullYear()}/${randomUUID()}.webp`;
  const { error: uploadError } = await admin.supabase.storage
    .from("site-media")
    .upload(storagePath, safeImage, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });
  if (uploadError) return { status: "error", message: "The replacement photograph could not be uploaded." };

  const { data: media, error: recordError } = await admin.supabase
    .from("media_assets")
    .insert({
      storage_path: storagePath,
      original_name: file.name.slice(0, 255),
      mime_type: "image/webp",
      file_size: safeImage.byteLength,
      media_kind: "image",
      alt_text: altText,
      caption: null,
      is_published: true,
      consent_confirmed: true,
      safeguarding_reviewed_at: new Date().toISOString(),
      created_by: admin.userId,
      updated_by: admin.userId,
    })
    .select("id")
    .single();

  if (recordError || !media) {
    await admin.supabase.storage.from("site-media").remove([storagePath]);
    return { status: "error", message: "The replacement photograph could not be saved." };
  }

  try {
    await assignUploadedImage(admin, targetValue, storagePath, altText);
  } catch {
    await admin.supabase.from("media_assets").delete().eq("id", media.id);
    await admin.supabase.storage.from("site-media").remove([storagePath]);
    return { status: "error", message: "The photograph uploaded, but the website position could not be updated safely." };
  }

  await admin.supabase.from("admin_audit_log").insert({
    actor_id: admin.userId,
    action: "update",
    entity_type: "website_image",
    entity_id: media.id,
    details: {
      target: targetValue,
      storage_path: storagePath,
      direct_replacement: true,
      metadata_removed: true,
    },
  });

  revalidateMediaPages();
  return { status: "success", message: "Photograph replaced and published successfully." };
}

function mediaPath(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (value.length > 500) throw new Error("An image reference is too long.");
  return value || null;
}

export async function updateWebsiteImages(
  _previousState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const admin = await getAdminContext();
  if (!admin) return { status: "error", message: "Your session has expired. Sign in again." };

  try {
    const heroImagePath = mediaPath(formData, "hero_imagePath");
    const storyImagePath = mediaPath(formData, "story_imagePath");
    const galleryMediaPaths = [
      ...new Set(
        formData
          .getAll("gallery_mediaPath")
          .map((item) => String(item).trim())
          .filter(Boolean),
      ),
    ].slice(0, 24);

    const slots = Object.fromEntries(
      websiteImageSlotKeys.map((key) => {
        const alt = String(formData.get(`${key}_alt`) ?? "").trim();
        if (!alt || alt.length > 180) {
          throw new Error("Every visible website photograph needs a description of 180 characters or fewer.");
        }
        return [
          key,
          {
            mediaPath: mediaPath(formData, `${key}_mediaPath`),
            visible: formData.get(`${key}_visible`) === "on",
            alt,
          },
        ];
      }),
    ) as WebsiteImageSettings["slots"];

    const galleryTitle = String(formData.get("gallery_title") ?? "").trim();
    if (!galleryTitle || galleryTitle.length > 100) {
      throw new Error("Add a gallery heading of no more than 100 characters.");
    }

    const selectedPaths = [
      heroImagePath,
      storyImagePath,
      ...websiteImageSlotKeys.map((key) => slots[key].mediaPath),
      ...galleryMediaPaths,
    ].filter((item): item is string => Boolean(item));

    if (selectedPaths.length) {
      const uniquePaths = [...new Set(selectedPaths)];
      const { data: eligibleMedia, error: mediaError } = await admin.supabase
        .from("media_assets")
        .select("storage_path")
        .in("storage_path", uniquePaths)
        .eq("media_kind", "image")
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .not("safeguarding_reviewed_at", "is", null);

      if (mediaError || (eligibleMedia ?? []).length !== uniquePaths.length) {
        throw new Error("Use only published, consent-confirmed photographs from the media library.");
      }
    }

    const [{ data: storedHero }, { data: storedEditor }] = await Promise.all([
      admin.supabase
        .from("site_content")
        .select("title, body, content")
        .eq("page_slug", "home")
        .eq("section_key", "hero")
        .maybeSingle(),
      admin.supabase
        .from("site_settings")
        .select("value")
        .eq("setting_key", "visual_editor")
        .maybeSingle(),
    ]);

    const storedHeroContent =
      storedHero?.content && typeof storedHero.content === "object"
        ? (storedHero.content as Record<string, unknown>)
        : {};
    const heroAlt = String(formData.get("hero_alt") ?? "").trim();
    const storyAlt = String(formData.get("story_alt") ?? "").trim();
    if (!heroAlt || heroAlt.length > 180 || !storyAlt || storyAlt.length > 180) {
      throw new Error("The homepage image descriptions must be 180 characters or fewer.");
    }

    const editor = parseSiteEditorSettings(storedEditor?.value);
    editor.homeSections.story.imagePath = storyImagePath;
    editor.homeSections.story.imageUrl = null;
    editor.homeSections.story.imageAlt = storyAlt;

    const websiteImages: WebsiteImageSettings = {
      slots,
      gallery: {
        visible: formData.get("gallery_visible") === "on",
        title: galleryTitle,
        mediaPaths: galleryMediaPaths,
      },
    };

    const heroResult = await admin.supabase.from("site_content").upsert(
      {
        page_slug: "home",
        section_key: "hero",
        title: storedHero?.title || fallbackHomeHero.title,
        body: storedHero?.body || fallbackHomeHero.description,
        content: {
          ...storedHeroContent,
          kicker:
            typeof storedHeroContent.kicker === "string"
              ? storedHeroContent.kicker
              : fallbackHomeHero.kicker,
          imagePath: heroImagePath,
          imageAlt: heroAlt,
        },
        is_published: true,
        updated_by: admin.userId,
      },
      { onConflict: "page_slug,section_key" },
    );
    if (heroResult.error) throw heroResult.error;

    const editorResult = await admin.supabase.from("site_settings").upsert(
      {
        setting_key: "visual_editor",
        label: "Safe visual website editor",
        value: editor,
        is_public: true,
        updated_by: admin.userId,
      },
      { onConflict: "setting_key" },
    );
    if (editorResult.error) throw editorResult.error;

    const { data: saved, error } = await admin.supabase
      .from("site_settings")
      .upsert(
        {
          setting_key: "website_images",
          label: "Website image placements and gallery",
          value: websiteImages,
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
      entity_id: saved.id,
      details: {
        setting_key: "website_images",
        gallery_items: galleryMediaPaths.length,
        controlled_fields: true,
      },
    });

    revalidateMediaPages();
    return { status: "success", message: "Website photographs and gallery saved and published." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to save the website photographs.",
    };
  }
}

export async function uploadImage(
  _previousState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const admin = await getAdminContext();
  if (!admin) return { status: "error", message: "Your session has expired. Sign in again." };

  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const consentConfirmed = formData.get("consentConfirmed") === "on";
  const publish = formData.get("publish") === "on";

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose an image to upload." };
  }
  if (!altText || altText.length > 180) {
    return { status: "error", message: "Add an image description of no more than 180 characters." };
  }
  if (caption.length > 300) {
    return { status: "error", message: "The caption must be 300 characters or fewer." };
  }
  if (!consentConfirmed) {
    return { status: "error", message: "Confirm that the Foundation has permission to publish this image." };
  }

  let safeImage: Buffer;

  try {
    safeImage = await processImage(file);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The image could not be safely processed.",
    };
  }

  const storagePath = `images/${new Date().getUTCFullYear()}/${randomUUID()}.webp`;

  const { error: uploadError } = await admin.supabase.storage
    .from("site-media")
    .upload(storagePath, safeImage, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) return { status: "error", message: "The image could not be uploaded." };

  const { data, error } = await admin.supabase
    .from("media_assets")
    .insert({
      storage_path: storagePath,
      original_name: file.name.slice(0, 255),
      mime_type: "image/webp",
      file_size: safeImage.byteLength,
      media_kind: "image",
      alt_text: altText,
      caption: caption || null,
      is_published: publish,
      consent_confirmed: true,
      safeguarding_reviewed_at: new Date().toISOString(),
      created_by: admin.userId,
      updated_by: admin.userId,
    })
    .select("id")
    .single();

  if (error) {
    await admin.supabase.storage.from("site-media").remove([storagePath]);
    return { status: "error", message: "The image record could not be saved." };
  }

  await admin.supabase.from("admin_audit_log").insert({
    actor_id: admin.userId,
    action: "create",
    entity_type: "media_asset",
    entity_id: data.id,
    details: {
      storage_path: storagePath,
      published: publish,
      metadata_removed: true,
      original_mime_type: file.type,
    },
  });

  revalidateMediaPages();
  return { status: "success", message: "Image uploaded successfully." };
}

export async function updateImage(
  id: string,
  _previousState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const admin = await getAdminContext();
  if (!admin) return { status: "error", message: "Your session has expired. Sign in again." };

  const altText = String(formData.get("altText") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!altText || altText.length > 180 || caption.length > 300) {
    return { status: "error", message: "Check the description and caption lengths." };
  }

  const { error } = await admin.supabase
    .from("media_assets")
    .update({ alt_text: altText, caption: caption || null, is_published: isPublished, updated_by: admin.userId })
    .eq("id", id);

  if (error) return { status: "error", message: "Unable to update this image." };

  await admin.supabase.from("admin_audit_log").insert({
    actor_id: admin.userId,
    action: isPublished ? "publish" : "unpublish",
    entity_type: "media_asset",
    entity_id: id,
    details: {},
  });

  revalidateMediaPages();
  return { status: "success", message: "Image details updated." };
}

export async function replaceImage(
  id: string,
  _previousState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const admin = await getAdminContext();
  if (!admin) return { status: "error", message: "Your session has expired. Sign in again." };
  if (!UUID_PATTERN.test(id)) return { status: "error", message: "This image reference is invalid." };

  const file = formData.get("replacementFile");
  const consentConfirmed = formData.get("replacementConsent") === "on";

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose the replacement image." };
  }
  if (!consentConfirmed) {
    return { status: "error", message: "Confirm permission to publish the replacement image." };
  }

  const { data: existing, error: lookupError } = await admin.supabase
    .from("media_assets")
    .select("storage_path")
    .eq("id", id)
    .eq("media_kind", "image")
    .maybeSingle();

  if (lookupError || !existing) {
    return { status: "error", message: "The image could not be found." };
  }

  let safeImage: Buffer;
  try {
    safeImage = await processImage(file);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The replacement could not be processed.",
    };
  }

  const { error: storageError } = await admin.supabase.storage
    .from("site-media")
    .update(existing.storage_path, safeImage, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    });

  if (storageError) {
    return { status: "error", message: "The replacement image could not be uploaded." };
  }

  const { error: updateError } = await admin.supabase
    .from("media_assets")
    .update({
      original_name: file.name.slice(0, 255),
      mime_type: "image/webp",
      file_size: safeImage.byteLength,
      consent_confirmed: true,
      safeguarding_reviewed_at: new Date().toISOString(),
      updated_by: admin.userId,
    })
    .eq("id", id);

  if (updateError) {
    return { status: "error", message: "The image changed, but its library record could not be updated." };
  }

  await admin.supabase.from("admin_audit_log").insert({
    actor_id: admin.userId,
    action: "update",
    entity_type: "media_asset",
    entity_id: id,
    details: {
      storage_path: existing.storage_path,
      file_replaced: true,
      metadata_removed: true,
      original_mime_type: file.type,
    },
  });

  revalidateMediaPages();
  return { status: "success", message: "Photograph replaced everywhere it is used." };
}

export async function deleteImage(
  id: string,
  _previousState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const admin = await getAdminContext();
  if (!admin) return { status: "error", message: "Your session has expired. Sign in again." };
  if (!UUID_PATTERN.test(id)) return { status: "error", message: "This image reference is invalid." };
  if (formData.get("confirmDelete") !== "on") {
    return { status: "error", message: "Tick the confirmation box before deleting this image." };
  }

  const { data: image, error: lookupError } = await admin.supabase
    .from("media_assets")
    .select("id, storage_path, original_name")
    .eq("id", id)
    .eq("media_kind", "image")
    .maybeSingle();

  if (lookupError || !image) {
    return { status: "error", message: "The image could not be found." };
  }

  const [contentResult, settingsResult, storiesResult, projectsResult, reportsResult] = await Promise.all([
    admin.supabase.from("site_content").select("page_slug, section_key, content"),
    admin.supabase.from("site_settings").select("label, value"),
    admin.supabase.from("stories").select("title").eq("cover_media_id", id),
    admin.supabase.from("projects").select("name").eq("cover_media_id", id),
    admin.supabase.from("reports").select("title").eq("media_id", id),
  ]);

  if (
    contentResult.error || settingsResult.error || storiesResult.error ||
    projectsResult.error || reportsResult.error
  ) {
    return { status: "error", message: "Deletion was stopped because image usage could not be checked safely." };
  }

  const usedIn = [
    ...(contentResult.data ?? [])
      .filter((row) => containsStoragePath(row.content, image.storage_path))
      .map((row) => `${row.page_slug} / ${row.section_key}`),
    ...(settingsResult.data ?? [])
      .filter((row) => containsStoragePath(row.value, image.storage_path))
      .map((row) => row.label),
    ...(storiesResult.data ?? []).map((row) => `Story: ${row.title}`),
    ...(projectsResult.data ?? []).map((row) => `Programme: ${row.name}`),
    ...(reportsResult.data ?? []).map((row) => `Report: ${row.title}`),
  ];

  if (usedIn.length) {
    return {
      status: "error",
      message: `This image is still used in ${usedIn.slice(0, 3).join(", ")}. Choose another image there before deleting it.`,
    };
  }

  const { error: deleteError } = await admin.supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (deleteError) return { status: "error", message: "The image could not be deleted." };

  const { error: storageError } = await admin.supabase.storage
    .from("site-media")
    .remove([image.storage_path]);

  await admin.supabase.from("admin_audit_log").insert({
    actor_id: admin.userId,
    action: "delete",
    entity_type: "media_asset",
    entity_id: id,
    details: {
      storage_path: image.storage_path,
      original_name: image.original_name,
      storage_removed: !storageError,
    },
  });

  revalidateMediaPages();
  return {
    status: "success",
    message: storageError
      ? "Image removed from the library. The inaccessible stored file is queued for later cleanup."
      : "Image permanently deleted.",
  };
}
