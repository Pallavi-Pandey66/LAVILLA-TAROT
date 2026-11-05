# Separate Supabase backend setup

Run `db/schema.sql` once in your separate project's SQL editor before allowing signups. It creates shared tables, all 36 oracle cards, access policies, and a signup trigger. **Tables are created during setup; one profile row is created automatically for each new account.** Running the script again preserves existing rows. It targets a fresh project or one with the same table definitions; `IF NOT EXISTS` does not upgrade incompatible existing tables.

After setup, run `db/tarot.sql` to add all 78 tarot cards and deck/arcana/suit/order metadata. Existing oracle IDs are preserved. Tarot uses distinct numbers 1000–1077 in the legacy unique database `number` field; actual tarot order is `sort_order` 0–77 and the display uses `numeral` (The Fool is 0). No tarot interpretations were supplied, so messages and reflection fields are intentionally empty rather than invented.

## Accounts and profiles

- Supabase Auth manages accounts, sessions, passwords, and email verification; do not create your own password table.
- Profiles contain `id`, `display_name`, `avatar_url`, `created_at`, and `updated_at`. There are no roles or email addresses in this table.
- The signup trigger reads optional `display_name` (or Google's `full_name`) and `avatar_url` metadata. Existing accounts receive a profile when the script runs.
- Signed-in users can read and edit only their own profile, readings, and favorites. Cards are publicly readable. Deleting an account deletes its profile, readings, and favorites.

## Configure authentication separately

SQL does not enable email delivery or OAuth providers. In your separate project, enable email sign-in/magic links, configure the site URL and allowed `/auth` callback URLs, and configure Google if needed. Leave email confirmation enabled. The current app uses passwordless email links, not a password signup form.

The app now connects to your external project at `https://jfxwenzpxhrpacgodrer.supabase.co` through its own browser client. The generated Lovable Cloud files remain untouched and are not used for app sign-in or saved data. Sessions use a separate storage key, so Cloud sessions cannot be mistaken for external accounts. Never put a service-role or secret key in browser code. Google now uses your external project's OAuth flow and returns to the public `/auth` page.

Connection checks found email enabled, signups allowed, email confirmation required, and Google disabled. The `profiles` table was missing. **Run `db/schema.sql` in your external project's SQL editor**, then add `https://id-preview--d818e48b-4b34-4404-8d54-7fba8410c687.lovable.app/auth*` to allowed redirect URLs (and your published domain's equivalent when published). Set the site URL to the app's public origin. Configure and enable Google in that external project if you want Google sign-in; its Google provider callback is `https://jfxwenzpxhrpacgodrer.supabase.co/auth/v1/callback`. The app cannot change these settings with a publishable key.

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

Local SQL tests verify profile creation, backfill, reruns, and user isolation. Public authentication settings were checked; actual email delivery, callback allowlisting, and signed-in profile/readings access remain unverified. Existing Cloud users and saved readings are not copied automatically.