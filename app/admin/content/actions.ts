"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin/auth";

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
