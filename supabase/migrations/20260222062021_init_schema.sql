-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================
-- PROFILES TABLE
-- =========================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'member',
  created_at timestamp with time zone default now()
);

-- =========================
-- PROJECTS TABLE
-- =========================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- =========================
-- TASKS TABLE
-- =========================
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

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
    auth.uid() = id  -- normal user sees their own row
    OR (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- Projects RLS
create policy "Users can manage their own projects"
on public.projects
for all
using ( auth.uid() = user_id );

-- Tasks RLS
create policy "Users can manage tasks of their projects"
on public.tasks
for all
using (
  auth.uid() in (
    select user_id from public.projects
    where id = project_id
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
