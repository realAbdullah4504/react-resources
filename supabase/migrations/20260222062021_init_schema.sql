-- =========================
-- PROFILES TABLE
-- =========================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- =========================
-- TEAM MEMBERS TABLE
-- =========================
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  invited_by uuid references public.profiles(id) on delete set null,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamp with time zone default now(),
  unique(user_id)
);

-- =========================
-- PROJECTS TABLE
-- =========================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- =========================
-- TASKS TABLE
-- =========================
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.team_members enable row level security;

-- RLS Policies

-- Profiles RLS
create policy "Users can view their own profile"
on public.profiles
for select
using ( auth.uid() = id );

create policy "Users can update their own profile"
on public.profiles
for update
using ( auth.uid() = id );

create policy "Users can insert their own profile"
on public.profiles
for insert
with check ( auth.uid() = id );

create policy "Admins can view all profiles via profile table"
on public.profiles
for select
using (
    auth.uid() = id
);

-- Team members RLS
create policy "Users can view their own team members"
on public.team_members
for all
using ( auth.uid() = invited_by );

-- Projects RLS
create policy "Owner and invited users can access projects"
on public.projects
for all
using (
  auth.uid() = user_id
  OR exists (
    select 1
    from public.team_members tm
    where tm.user_id = auth.uid()
      and tm.invited_by = projects.user_id
  )
)
with check (auth.uid() = user_id);

-- Tasks RLS
create policy "Users can Read tasks of their projects"
on public.tasks
for select
using (
  exists (
    select 1 from
    public.projects p
    where p.id = project_id
    and (
      p.user_id = auth.uid()
      OR exists (
        select 1
        from public.team_members tm
        where tm.user_id = auth.uid()
          and tm.invited_by = p.user_id
      )
    )
  )
);

create policy "Users can insert tasks in their own projects"
on public.tasks
for insert
with check (
  exists (
    select 1 from
    public.projects p
    where p.id = project_id
    and ( 
      p.user_id = auth.uid()
      OR exists (
        select 1
        from public.team_members tm
        where tm.user_id = auth.uid()
          and tm.invited_by = p.user_id
      )
    )
  )
);

create policy "Users can delete their own tasks "
on public.tasks
for delete
using ( 
  exists (
    select 1 from
    public.projects p
    where p.id = project_id
    and p.user_id = auth.uid()
  )
);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Storage policies
create policy "Users can upload their own avatar"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can read avatars"
on storage.objects
for select
using ( bucket_id = 'avatars' );
