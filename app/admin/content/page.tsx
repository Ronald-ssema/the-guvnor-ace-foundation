import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminContext } from "@/lib/admin/auth";
import { fallbackHomeHero, getHomeHeroContent } from "@/lib/cms/home";
import ContentEditor from "./ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/mfa");

  const [{ data: storedHero }, { data: media }] = await Promise.all([
    admin.supabase
      .from("site_content")
      .select("title, body, content")
      .eq("page_slug", "home")
      .eq("section_key", "hero")
      .maybeSingle(),
    admin.supabase
      .from("media_assets")
      .select("storage_path, original_name, alt_text")
      .eq("media_kind", "image")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  let hero = await getHomeHeroContent();
  if (storedHero) {
    const content = (storedHero.content ?? {}) as Record<string, unknown>;
    hero = {
      kicker: typeof content.kicker === "string" ? content.kicker : fallbackHomeHero.kicker,
      title: storedHero.title || fallbackHomeHero.title,
      description: storedHero.body || fallbackHomeHero.description,
      imagePath: typeof content.imagePath === "string" ? content.imagePath : null,
      imageUrl: null,
      imageAlt: typeof content.imageAlt === "string" ? content.imageAlt : fallbackHomeHero.imageAlt,
    };
  }

  return (
    <AdminShell
      email={admin.email}
      role={admin.role}
      title="Homepage content"
      description="Update the main message and choose a safeguarding-approved image."
    >
      <ContentEditor hero={hero} media={media ?? []} />
    </AdminShell>
  );
}
