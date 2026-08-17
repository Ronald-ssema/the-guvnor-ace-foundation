"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin/auth";

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
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
    return { status: "error", message: "Use a JPG, PNG or WebP image no larger than 5 MB." };
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

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type)) {
    return { status: "error", message: "The file content does not match its image type." };
  }

  const extension = ALLOWED_TYPES.get(file.type)!;
  const storagePath = `images/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await admin.supabase.storage
    .from("site-media")
    .upload(storagePath, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) return { status: "error", message: "The image could not be uploaded." };

  const { data, error } = await admin.supabase
    .from("media_assets")
    .insert({
      storage_path: storagePath,
      original_name: file.name.slice(0, 255),
      mime_type: file.type,
      file_size: file.size,
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
    details: { storage_path: storagePath, published: publish },
  });

  revalidatePath("/admin/media");
  revalidatePath("/admin/content");
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

  revalidatePath("/admin/media");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { status: "success", message: "Image details updated." };
}
