# The Guvnor Ace Foundation website

Public charity website and protected content-management portal built with Next.js and Supabase.

## What administrators can manage

- Sign in at `/admin/login` using Supabase Auth and mandatory authenticator-app MFA.
- Edit and publish the homepage hero message.
- Upload JPG, PNG and WebP photographs up to 5 MB. Files are decoded,
  resized, converted to WebP and stripped of embedded metadata before storage.
- Record publication permission, accessible image descriptions and captions.
- Publish or unpublish media and select a published homepage photograph.

The original hard-coded homepage content remains the public fallback until a published database record exists.

## Local setup

1. Install Node.js 20 and run `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local`.
3. Link the repository to the intended Supabase project with the Supabase CLI.
4. Apply the migrations in `supabase/migrations`.
5. Run `npm run dev` and open `http://localhost:3000`.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` in production
- `RATE_LIMIT_SECRET` (a random server-only value of at least 32 bytes)

Only variables prefixed with `NEXT_PUBLIC_` are exposed to browsers. Never use or expose a Supabase service-role key in this application.

## Provision the first owner

Create the person in Supabase Authentication first. Then run the following in the Supabase SQL editor, replacing only the placeholder email:

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'owner'
from auth.users
where lower(email) = lower('OWNER_EMAIL@example.org')
on conflict (user_id) do update
set user_id = excluded.user_id,
    email = excluded.email,
    updated_at = now();
```

The query must affect exactly one row. Do not commit a real email address or Auth UUID to a migration.

## Add an editor

Create the editor in Supabase Authentication, then run:

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'editor'
from auth.users
where lower(email) = lower('EDITOR_EMAIL@example.org');
```

Owners and editors can manage website content. Keep the owner role limited to the person accountable for the website.

On the first successful password sign-in, the administrator is sent to
`/admin/mfa`. They must scan the QR code with an authenticator app and verify a
six-digit code. Database policies require an `aal2` session, so a stolen
password-only session cannot read or change protected content.

Store MFA recovery procedures securely outside the repository. Removing or
resetting a lost factor is an accountable owner operation in the Supabase
Authentication dashboard.

## Deployment order

1. Create separate Supabase projects for development/staging and production.
2. Apply migrations to staging and run all checks.
3. Configure production environment variables in the hosting platform.
4. Apply the same migrations to production.
5. Provision the production owner using the documented SQL step.
6. Deploy the application, verify `/`, `/admin/login`, an authenticated edit and an image upload.
7. Configure uptime monitoring against `/api/health`, production error alerts,
   Supabase backup retention and a documented restore test.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run test:run
npx playwright test
npm run build
```

Uploaded images should only be published when the Foundation holds suitable individual or parental permission. Avoid identifying vulnerable children unnecessarily and keep supporting consent records outside the public website.

The `site-media` bucket is private. Public pages receive short-lived signed URLs
only for media records that are published, consent-confirmed and safeguarding
reviewed. Unpublishing the database record prevents new signed URLs from being
issued.
