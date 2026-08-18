"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { getAdminContext } from "@/lib/admin/auth";
import { containsStoragePath } from "@/lib/admin/mediaReferences";

export type MediaActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

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
