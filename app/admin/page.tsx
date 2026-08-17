import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import { getAdminContext } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const admin = await getAdminContext()
  if (!admin) {
    redirect('/admin/mfa')
  }

  return (
    <AdminShell email={admin.email} role={admin.role} title="Overview" description="Manage public content with safeguarding and accessibility built into the workflow.">
      <div className="admin-media-grid">
        <Link className="admin-card" href="/admin/content">
          <p className="section-eyebrow">Content</p>
          <h2>Homepage content</h2>
          <p>Update the main message and hero photograph.</p>
        </Link>
        <Link className="admin-card" href="/admin/media">
          <p className="section-eyebrow">Media</p>
          <h2>Photos and media</h2>
          <p>Upload consent-cleared images, descriptions and captions.</p>
        </Link>
      </div>
    </AdminShell>
  )
}
