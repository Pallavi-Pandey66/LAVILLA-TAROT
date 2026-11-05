<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep `db/schema.sql` as a standalone external-backend setup script, not a Cloud migration; test its signup triggers and RLS locally without changing the connected backend.
- Use the lazy external browser client in `src/lib/supabase.ts` for app auth and user data, with isolated session storage and external OAuth; generated Cloud integration files remain managed and unused by these flows.
- Keep oracle daily selection isolated; use the shared catalog for browsing and journal lookup, with distinct stable tarot IDs and slugs to preserve historical oracle readings.
