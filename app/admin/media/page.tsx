import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminContext } from "@/lib/admin/auth";
import { MediaCard, MediaUploadForm } from "./MediaForms";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/login");

  const { data: media } = await admin.supabase
    .from("media_assets")
    .select("id, storage_path, original_name, alt_text, caption, is_published")
    .eq("media_kind", "image")
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      email={admin.email}
      role={admin.role}
      title="Photos and media"
      description="Upload consent-cleared images and control what appears publicly."
    >
      <MediaUploadForm />
      <section className="admin-library" aria-labelledby="library-heading">
        <div className="admin-section-heading">
          <div><p>Library</p><h2 id="library-heading">Uploaded photographs</h2></div>
          <span>{media?.length ?? 0} items</span>
        </div>
        {media?.length ? (
          <div className="admin-media-grid">
            {media.map((item) => <MediaCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="admin-empty-state">No photographs have been uploaded yet.</div>
        )}
      </section>
    </AdminShell>
  );
}
