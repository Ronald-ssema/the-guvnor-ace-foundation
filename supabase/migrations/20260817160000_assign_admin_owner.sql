-- Owner accounts are deliberately not assigned in a portable migration.
-- Create the Auth user in the Supabase dashboard, then follow README.md to
-- grant that existing user the owner role. This keeps personal identifiers and
-- environment-specific Auth UUIDs out of source control.

do $$
begin
  raise notice 'Admin schema ready. Provision the first owner using the documented setup step.';
end;
$$;
