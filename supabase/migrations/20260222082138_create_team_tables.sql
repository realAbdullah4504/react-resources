-- =========================
-- TEAM MEMBERS TABLE
-- =========================
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamp with time zone default now(),
  unique(user_id)
);