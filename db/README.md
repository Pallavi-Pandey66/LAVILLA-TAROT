# Separate Supabase backend setup

Run `db/schema.sql` once in your separate project's SQL editor before allowing signups. It creates shared tables, all 36 oracle cards, access policies, and a signup trigger. **Tables are created during setup; one profile row is created automatically for each new account.** Running the script again preserves existing rows. It targets a fresh project or one with the same table definitions; `IF NOT EXISTS` does not upgrade incompatible existing tables.

## Accounts and profiles

- Supabase Auth manages accounts, sessions, passwords, and email verification; do not create your own password table.
- Profiles contain `id`, `display_name`, `avatar_url`, `created_at`, and `updated_at`. There are no roles or email addresses in this table.
- The signup trigger reads optional `display_name` (or Google's `full_name`) and `avatar_url` metadata. Existing accounts receive a profile when the script runs.
- Signed-in users can read and edit only their own profile, readings, and favorites. Cards are publicly readable. Deleting an account deletes its profile, readings, and favorites.

## Configure authentication separately

SQL does not enable email delivery or OAuth providers. In your separate project, enable email sign-in/magic links, configure the site URL and allowed `/auth` callback URLs, and configure Google if needed. Leave email confirmation enabled. The current app uses passwordless email links, not a password signup form.

This Lovable app **still connects to Lovable Cloud**; this script does not switch its connection. To use it in a separately hosted copy, configure that copy's browser client with your external project's URL and publishable key. Never put a service-role or secret key in browser code. Replace the Lovable-managed Google flow in that separate copy with the external project's OAuth flow; callback URLs must return to its public `/auth` page.

Example for the external copy's configured client:

```ts
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth`,
    data: { display_name: displayName },
  },
});

await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${window.location.origin}/auth` },
});

// After the email link/OAuth callback establishes a session:
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) throw new Error("Please sign in first.");
const { data: profile, error: profileError } = await supabase
  .from("profiles").select("*").eq("id", user.id).single();
if (profileError) throw profileError;
```

Local SQL tests verify profile creation, backfill, reruns, and user isolation. Authentication settings, email delivery, and sign-in against your separate hosted project remain unverified until it is configured.