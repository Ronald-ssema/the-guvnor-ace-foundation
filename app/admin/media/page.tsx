import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminContext } from "@/lib/admin/auth";
import { fallbackHomeHero } from "@/lib/cms/home";
import { fallbackSiteEditorSettings, parseSiteEditorSettings } from "@/lib/cms/siteEditor";
import { parseWebsiteImageSettings } from "@/lib/cms/websiteImages";
import { MediaCard, MediaUploadForm, WebsiteImageManager } from "./MediaForms";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/mfa");

  const [{ data: media }, { data: storedHero }, { data: storedEditor }, { data: storedImages }] =
    await Promise.all([
      admin.supabase
        .from("media_assets")
        .select("id, storage_path, original_name, alt_text, caption, is_published, consent_confirmed, safeguarding_reviewed_at")
        .eq("media_kind", "image")
        .order("created_at", { ascending: false }),
      admin.supabase
        .from("site_content")
        .select("content")
        .eq("page_slug", "home")
        .eq("section_key", "hero")
        .maybeSingle(),
      admin.supabase
        .from("site_settings")
        .select("value")
        .eq("setting_key", "visual_editor")
        .maybeSingle(),
      admin.supabase
        .from("site_settings")
        .select("value")
        .eq("setting_key", "website_images")
        .maybeSingle(),
    ]);

  const mediaWithUrls = await Promise.all(
    (media ?? []).map(async (item) => {
      const { data } = await admin.supabase.storage
        .from("site-media")
        .createSignedUrl(item.storage_path, 900);

      return { ...item, image_url: data?.signedUrl ?? null };
    }),
  );

  const eligibleMedia = mediaWithUrls.filter(
    (item) => item.is_published && item.consent_confirmed && item.safeguarding_reviewed_at,
  );
  const heroContent =
    storedHero?.content && typeof storedHero.content === "object"
      ? (storedHero.content as Record<string, unknown>)
      : {};
  const editor = storedEditor
    ? parseSiteEditorSettings(storedEditor.value)
    : fallbackSiteEditorSettings;

  return (
    <AdminShell
      email={admin.email}
      role={admin.role}
      title="Photos and media"
      description="Upload, replace and safely delete consent-cleared photographs used across the website."
    >
      <WebsiteImageManager
        media={eligibleMedia}
        settings={parseWebsiteImageSettings(storedImages?.value)}
        hero={{
          mediaPath: typeof heroContent.imagePath === "string" ? heroContent.imagePath : null,
          alt: typeof heroContent.imageAlt === "string" ? heroContent.imageAlt : fallbackHomeHero.imageAlt,
        }}
        story={{
          mediaPath: editor.homeSections.story.imagePath,
          alt: editor.homeSections.story.imageAlt,
        }}
      />

      <MediaUploadForm />
      <section className="admin-library" aria-labelledby="library-heading">
        <div className="admin-section-heading">
          <div><p>Library</p><h2 id="library-heading">Uploaded photographs</h2></div>
          <span>{mediaWithUrls.length} items</span>
        </div>
        {mediaWithUrls.length ? (
          <div className="admin-media-grid">
            {mediaWithUrls.map((item) => <MediaCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="admin-empty-state">No photographs have been uploaded yet.</div>
        )}
      </section>
    </AdminShell>
  );
}
