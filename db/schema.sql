-- Lumina Oracle: standalone setup for a separate Supabase project.
-- Run before signups. Tables are shared; the trigger creates a profile ROW per account.
-- Authentication providers, email delivery and callback URLs require separate configuration.
-- Intended for a fresh database or matching existing tables, not incompatible schemas.
begin;
grant usage on schema public to anon, authenticated, service_role;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.lumina_create_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  ) on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.lumina_create_profile() from public, anon, authenticated;
drop trigger if exists lumina_on_auth_user_created on auth.users;
create trigger lumina_on_auth_user_created after insert on auth.users
  for each row execute function public.lumina_create_profile();

create or replace function public.lumina_touch_profile()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.lumina_touch_profile() from public, anon, authenticated;
drop trigger if exists lumina_profile_updated on public.profiles;
create trigger lumina_profile_updated before update on public.profiles
  for each row execute function public.lumina_touch_profile();

-- Backfill accounts that signed up before this setup; preserve edited profiles.
insert into public.profiles (id, display_name, avatar_url)
select id, coalesce(raw_user_meta_data ->> 'display_name', raw_user_meta_data ->> 'full_name', ''),
       nullif(raw_user_meta_data ->> 'avatar_url', '')
from auth.users on conflict (id) do nothing;

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  slug text not null unique,
  name text not null,
  theme text not null,
  keywords text[] not null default '{}',
  message text not null,
  reflection text not null,
  motif text not null
);
grant select on public.cards to anon, authenticated;
grant all on public.cards to service_role;
alter table public.cards enable row level security;
drop policy if exists "Cards are readable by everyone" on public.cards;
create policy "Cards are readable by everyone" on public.cards for select to anon, authenticated using (true);
create index if not exists cards_theme_idx on public.cards (theme);

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  spread_type text not null check (spread_type in ('single', 'three')),
  card_ids uuid[] not null,
  intention text,
  note text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.readings to authenticated;
grant all on public.readings to service_role;
alter table public.readings enable row level security;
drop policy if exists "Users read own readings" on public.readings;
create policy "Users read own readings" on public.readings for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users insert own readings" on public.readings;
create policy "Users insert own readings" on public.readings for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users update own readings" on public.readings;
create policy "Users update own readings" on public.readings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own readings" on public.readings;
create policy "Users delete own readings" on public.readings for delete to authenticated using (auth.uid() = user_id);
create index if not exists readings_user_created_idx on public.readings (user_id, created_at desc);

create table if not exists public.favorites (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, card_id)
);
grant select, insert, update, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;
drop policy if exists "Users read own favorites" on public.favorites;
create policy "Users read own favorites" on public.favorites for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users insert own favorites" on public.favorites;
create policy "Users insert own favorites" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users update own favorites" on public.favorites;
create policy "Users update own favorites" on public.favorites for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own favorites" on public.favorites;
create policy "Users delete own favorites" on public.favorites for delete to authenticated using (auth.uid() = user_id);
create index if not exists favorites_card_idx on public.favorites (card_id);

insert into public.cards (id, number, slug, name, theme, keywords, message, reflection, motif) values
  ('a1000000-0000-4000-8000-000000000001', 1, 'the-moon', 'The Moon', 'intuition', ARRAY['Intuition', 'Receptivity', 'Inner knowing'], 'Some truths arrive quietly, the way moonlight finds a room. Let yourself trust what you sense before you can fully explain it. Your inner knowing has been speaking softly all along.', 'What do you already know that you have not yet said aloud?', 'crescent cradling a small circle'),
  ('a1000000-0000-4000-8000-000000000002', 2, 'the-sun', 'The Sun', 'vitality', ARRAY['Vitality', 'Warmth', 'Presence'], 'There is a warmth in you that does not need permission to shine. Let yourself be seen in your full light today. Energy returns when you stop dimming what is naturally bright.', 'Where in your life are you ready to take up a little more space?', 'circle with 12 alternating long and short rays'),
  ('a1000000-0000-4000-8000-000000000003', 3, 'the-star', 'The Star', 'hope', ARRAY['Hope', 'Renewal', 'Faith'], 'Even on the darkest nights, a single point of light can guide the way home. Hope is not naivety; it is a quiet decision to keep looking up. Let something gentle restore you.', 'What small light are you holding on to right now?', 'eight-pointed star inside a thin ring'),
  ('a1000000-0000-4000-8000-000000000004', 4, 'the-eye', 'The Eye', 'clarity', ARRAY['Clarity', 'Perception', 'Honesty'], 'When the noise settles, things become simple to see. Look at the situation as it is, not as you fear or wish it to be. Clear sight is a kindness you can offer yourself.', 'If you looked at this with fresh eyes, what would you notice first?', 'almond eye with radiating rays above'),
  ('a1000000-0000-4000-8000-000000000005', 5, 'the-key', 'The Key', 'unlocking', ARRAY['Access', 'Solution', 'Permission'], 'The answer you have been searching for may already be in your hand. Sometimes what unlocks a situation is a single honest question or a small, brave step. Try the door again.', 'What permission are you waiting to give yourself?', 'ornate key with a circular bow'),
  ('a1000000-0000-4000-8000-000000000006', 6, 'the-door', 'The Door', 'threshold', ARRAY['Threshold', 'Opportunity', 'Courage'], 'You are standing at the edge of something new, and light is already spilling through. You do not need to see the whole room to take the first step. Thresholds ask only for willingness.', 'What is waiting for you on the other side of this choice?', 'arched doorway with light spilling through'),
  ('a1000000-0000-4000-8000-000000000007', 7, 'the-path', 'The Path', 'direction', ARRAY['Direction', 'Patience', 'Progress'], 'Not every road is straight, and that is part of its wisdom. Each turn has shaped your view of the horizon. Keep walking at your own pace; the way reveals itself as you go.', 'What is the next single step you can take with confidence?', 'winding line rising to a horizon sun'),
  ('a1000000-0000-4000-8000-000000000008', 8, 'the-lantern', 'The Lantern', 'guidance', ARRAY['Guidance', 'Support', 'Steadiness'], 'You do not need to light the whole path, only the few steps in front of you. Guidance often comes in modest forms: a friend, a book, a quiet hunch. Let yourself be helped.', 'Who or what has been a steady light for you lately?', 'hanging lantern with a small flame'),
  ('a1000000-0000-4000-8000-000000000009', 9, 'the-feather', 'The Feather', 'lightness', ARRAY['Lightness', 'Ease', 'Play'], 'Not everything needs to be carried so heavily. Allow a little softness, a little humor, a little air. What you hold lightly often moves more freely toward you.', 'What could you set down today, even just for a while?', 'single feather with a fine central quill'),
  ('a1000000-0000-4000-8000-000000000010', 10, 'the-messenger', 'The Messenger', 'signs', ARRAY['Signs', 'Communication', 'Attention'], 'Pay gentle attention to what keeps returning: a word, a song, a thought. Meaning often travels on ordinary wings. Be open to the conversations life is trying to start with you.', 'What message has been repeating itself in your life?', 'bird in flight, symmetrical wings'),
  ('a1000000-0000-4000-8000-000000000011', 11, 'the-serpent', 'The Serpent', 'renewal', ARRAY['Renewal', 'Cycles', 'Shedding'], 'Endings and beginnings are part of one continuous circle. You are allowed to outgrow old skins, habits and stories. What falls away makes room for a truer version of you.', 'What are you ready to shed so that something new can grow?', 'ouroboros circle'),
  ('a1000000-0000-4000-8000-000000000012', 12, 'the-tree', 'The Tree', 'growth and roots', ARRAY['Growth', 'Grounding', 'Belonging'], 'The higher a tree reaches, the deeper its roots must go. Tend to what nourishes you beneath the surface. Steady growth is built on quiet, patient foundations.', 'What keeps you rooted when life feels uncertain?', 'branches mirrored by roots inside a circle'),
  ('a1000000-0000-4000-8000-000000000013', 13, 'the-seed', 'The Seed', 'potential', ARRAY['Potential', 'Beginnings', 'Trust'], 'Something small and full of promise is beginning in you. It does not need to bloom today. Give it time, warmth and attention, and trust the unseen work of becoming.', 'What idea or hope deserves a little more care from you?', 'seed splitting with a sprout'),
  ('a1000000-0000-4000-8000-000000000014', 14, 'the-mountain', 'The Mountain', 'endurance', ARRAY['Endurance', 'Resilience', 'Perspective'], 'Mountains are not climbed in a single stride. Your strength is shown in steady return, not in speed. Rest when you need to; the summit will still be there.', 'What has your persistence already carried you through?', 'three peaks with a moon above'),
  ('a1000000-0000-4000-8000-000000000015', 15, 'the-river', 'The River', 'flow', ARRAY['Flow', 'Adaptability', 'Movement'], 'Water does not force its way; it finds its way. Let yourself move with what is unfolding rather than against it. There is grace in adapting without losing your direction.', 'Where could you allow more ease instead of effort?', 'three sinuous parallel lines'),
  ('a1000000-0000-4000-8000-000000000016', 16, 'the-tide', 'The Tide', 'release', ARRAY['Release', 'Rhythm', 'Surrender'], 'Everything has its season of coming in and going out. You can let go without losing what truly matters. Trust the rhythm; what is meant for you returns in its own time.', 'What are you holding on to that is ready to drift away?', 'curling wave with a crescent'),
  ('a1000000-0000-4000-8000-000000000017', 17, 'the-flame', 'The Flame', 'passion', ARRAY['Passion', 'Desire', 'Creativity'], 'There is a spark in you that wants to be tended, not hidden. Follow what makes you feel alive and curious. A small, steady flame can warm an entire life.', 'What lights you up in a way you cannot quite explain?', 'teardrop flame with an inner flame'),
  ('a1000000-0000-4000-8000-000000000018', 18, 'the-wind', 'The Wind', 'change', ARRAY['Change', 'Freshness', 'Movement'], 'A change in the air is clearing space for something fresh. You do not have to know where the wind is going to feel its lift. Open the windows of your mind and breathe.', 'What change would you welcome if fear were not part of it?', 'spiral gusts'),
  ('a1000000-0000-4000-8000-000000000019', 19, 'the-crystal', 'The Crystal', 'focus', ARRAY['Focus', 'Intention', 'Precision'], 'Light becomes brilliant when it passes through a clear form. Gather your attention on what matters most to you now. Fewer things, held with care, can shine brightly.', 'What deserves your full and undivided attention?', 'faceted hexagonal gem'),
  ('a1000000-0000-4000-8000-000000000020', 20, 'the-mirror', 'The Mirror', 'self-reflection', ARRAY['Reflection', 'Self-awareness', 'Acceptance'], 'What you notice in others may be showing you something about yourself. Look with curiosity rather than judgment. Being honest with yourself is the beginning of being gentle with yourself.', 'What are you learning about yourself through the people around you?', 'oval hand mirror with a star glint'),
  ('a1000000-0000-4000-8000-000000000021', 21, 'the-veil', 'The Veil', 'mystery', ARRAY['Mystery', 'Patience', 'The unknown'], 'Not everything is meant to be understood right away. Some things are revealed slowly, in their own time. Let the unknown be a place of wonder rather than worry.', 'How might you rest more comfortably with what you cannot yet see?', 'draped curved lines over a circle'),
  ('a1000000-0000-4000-8000-000000000022', 22, 'the-bridge', 'The Bridge', 'connection', ARRAY['Connection', 'Reconciliation', 'Understanding'], 'A bridge is built from both sides. Reaching out, listening, or forgiving can close a distance that once felt wide. Connection often begins with one sincere gesture.', 'Is there a relationship that would benefit from you reaching out?', 'arched bridge reflected in water'),
  ('a1000000-0000-4000-8000-000000000023', 23, 'the-compass', 'The Compass', 'purpose', ARRAY['Purpose', 'Values', 'Orientation'], 'When you feel unsure, return to what you value most. Your values are a quiet north that does not move. Let them orient your choices more than outside expectations.', 'Which of your values feels most important to honor right now?', 'compass rose, 4 long points and 4 short'),
  ('a1000000-0000-4000-8000-000000000024', 24, 'the-hourglass', 'The Hourglass', 'timing', ARRAY['Timing', 'Patience', 'Presence'], 'Some things cannot be rushed, and some moments will not wait. Notice which is which. Being present with the grain of time falling now is often enough.', 'Are you waiting for the right time, or is the right time now?', 'hourglass with a thin sand stream'),
  ('a1000000-0000-4000-8000-000000000025', 25, 'the-crown', 'The Crown', 'sovereignty', ARRAY['Sovereignty', 'Self-respect', 'Leadership'], 'You are the author of your own choices. Wear your dignity lightly but surely. Leading your life with kindness and conviction is its own quiet kind of royalty.', 'Where are you being called to stand in your own authority?', 'minimal three-point crown with small orbs'),
  ('a1000000-0000-4000-8000-000000000026', 26, 'the-open-heart', 'The Open Heart', 'compassion', ARRAY['Compassion', 'Tenderness', 'Openness'], 'An open heart is not a fragile one; it is a brave one. Offer yourself the same compassion you so easily give to others. Softness can be a source of great strength.', 'How can you be a little kinder to yourself today?', 'heart outline with a small star inside'),
  ('a1000000-0000-4000-8000-000000000027', 27, 'the-hands', 'The Hands', 'offering', ARRAY['Generosity', 'Receiving', 'Service'], 'Open hands can both give and receive. Notice what you have to offer and what you are being offered in return. Exchange, freely made, enriches everyone involved.', 'What gift could you share, and what help could you accept?', 'two open palms holding a small orb'),
  ('a1000000-0000-4000-8000-000000000028', 28, 'the-anchor', 'The Anchor', 'stability', ARRAY['Stability', 'Security', 'Calm'], 'When the waters feel restless, return to what holds you steady. Simple routines, trusted people and familiar places can ground you. Stability is something you can create from within.', 'What helps you feel safe and steady when things move quickly?', 'anchor inside a circle'),
  ('a1000000-0000-4000-8000-000000000029', 29, 'the-butterfly', 'The Butterfly', 'transformation', ARRAY['Transformation', 'Growth', 'Emergence'], 'Change can feel uncomfortable while it is happening. Yet every stage has its purpose, even the quiet and hidden ones. Something beautiful is forming in you.', 'What part of you is in the middle of becoming something new?', 'symmetrical wings'),
  ('a1000000-0000-4000-8000-000000000030', 30, 'the-owl', 'The Owl', 'wisdom', ARRAY['Wisdom', 'Observation', 'Discernment'], 'Wisdom often speaks the least and notices the most. Take a moment to observe before you respond. You may find that the right answer is calmer than you expected.', 'What would the wisest version of you do in this situation?', 'geometric owl face'),
  ('a1000000-0000-4000-8000-000000000031', 31, 'the-lotus', 'The Lotus', 'awakening', ARRAY['Awakening', 'Grace', 'Rising'], 'The lotus grows from the mud and blooms clean above the water. Your experiences, even the difficult ones, have fed your growth. Let yourself open toward the light.', 'What has a challenging time taught you that you now value?', 'seven-petal lotus'),
  ('a1000000-0000-4000-8000-000000000032', 32, 'the-spiral', 'The Spiral', 'inner journey', ARRAY['Inner journey', 'Depth', 'Returning'], 'You may feel as if you are circling the same lessons, but each turn brings you closer to the center. Growth is rarely linear. Every return carries new understanding.', 'What familiar lesson is showing up again, and what is different this time?', 'golden-ratio spiral'),
  ('a1000000-0000-4000-8000-000000000033', 33, 'the-eclipse', 'The Eclipse', 'shadow work', ARRAY['Shadow', 'Integration', 'Wholeness'], 'The parts of yourself you keep in shadow still deserve understanding. Meeting them with patience makes you more whole, not less. Light and dark together create the full picture.', 'What part of yourself would benefit from more acceptance?', 'circle overlapping a crescent with a corona'),
  ('a1000000-0000-4000-8000-000000000034', 34, 'the-dawn', 'The Dawn', 'new beginnings', ARRAY['Beginnings', 'Freshness', 'Possibility'], 'Every morning offers a clean page. You do not have to carry yesterday into today. Begin again, gently, with whatever light you have.', 'If today were a fresh start, how would you like it to begin?', 'half sun on a horizon line'),
  ('a1000000-0000-4000-8000-000000000035', 35, 'the-chalice', 'The Chalice', 'abundance', ARRAY['Abundance', 'Gratitude', 'Fullness'], 'Your cup is fuller than it may seem. Gratitude has a way of revealing riches that were already present. Let yourself receive, enjoy and share what is good.', 'What are you grateful for that you rarely pause to notice?', 'chalice with a rising star'),
  ('a1000000-0000-4000-8000-000000000036', 36, 'the-thread', 'The Thread', 'connection and fate', ARRAY['Connection', 'Meaning', 'Weaving'], 'The moments of your life are stitched together in ways you may only see later. People, places and choices weave a larger pattern. Trust that your thread belongs in the whole.', 'Looking back, which unexpected connection shaped you the most?', 'continuous looped thread with a small needle')
on conflict (id) do nothing;

commit;
