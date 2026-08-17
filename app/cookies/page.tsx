import { createPageMetadata } from "@/lib/seo";
import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

export const metadata = createPageMetadata({
  title: "Cookie Information",
  description: "Information about cookies and similar technologies used by The Guvnor Ace Foundation website.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <PolicyPageLayout
      eyebrow="Privacy"
      title="Cookie Information"
      description="A clear explanation of the browser storage used by this website."
      lastReviewed="17 August 2026"
      navigation={[
        { label: "Public website", href: "#public" },
        { label: "Administrator cookies", href: "#admin" },
        { label: "Changes", href: "#changes" },
      ]}
    >
      <section id="public">
        <h2>Public website</h2>
        <p>
          The public website does not currently use advertising or analytics
          cookies. Following links to external services such as GoFundMe or
          social networks may allow those services to set cookies under their
          own policies.
        </p>
      </section>
      <section id="admin">
        <h2>Administrator sign-in</h2>
        <p>
          Strictly necessary authentication cookies are used when an authorised
          administrator signs in. They protect the admin session and enable the
          requested secure website-management service. The admin portal cannot
          operate correctly without them.
        </p>
      </section>
      <section id="changes">
        <h2>If our use of cookies changes</h2>
        <p>
          We will update this page before introducing non-essential cookies and
          will provide an appropriate consent choice where required.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
