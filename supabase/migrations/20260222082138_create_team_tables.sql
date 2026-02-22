-- =========================
-- TEAMS TABLE
-- =========================
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =========================
-- TEAM_MEMBERS TABLE
-- =========================
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default now(),
  unique(team_id, user_id) -- Prevent duplicate team memberships
);

-- =========================
-- TEAM_INVITATIONS TABLE
-- =========================
create table public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  invited_by uuid references public.profiles(id) on delete cascade,
  invited_email text not null,
  role text not null check (role in ('admin', 'member')),
  status text not null check (status in ('pending', 'accepted', 'rejected', 'expired')),
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- =========================
-- INDEXES FOR PERFORMANCE
-- =========================
create index idx_teams_created_by on public.teams(created_by);
create index idx_team_members_team_id on public.team_members(team_id);
create index idx_team_members_user_id on public.team_members(user_id);
create index idx_team_members_role on public.team_members(role);
create index idx_team_invitations_team_id on public.team_invitations(team_id);
create index idx_team_invitations_email on public.team_invitations(invited_email);
create index idx_team_invitations_status on public.team_invitations(status);
create index idx_team_invitations_token on public.team_invitations(token);


-- =========================
-- COMMENTS FOR DOCUMENTATION
-- =========================
comment on table public.teams is 'Main teams table for organization management';
comment on column public.teams.name is 'Display name of the team';
comment on column public.teams.description is 'Optional description of the team purpose';
comment on column public.teams.created_by is 'Reference to the user who created the team';

comment on table public.team_members is 'Junction table for team membership';
comment on column public.team_members.role is 'Role of the user within the team (owner, admin, member)';
comment on column public.team_members.joined_at is 'When the user joined the team';

comment on table public.team_invitations is 'Invitations for users to join teams';
comment on column public.team_invitations.status is 'Status of the invitation (pending, accepted, rejected, expired)';
comment on column public.team_invitations.token is 'Unique token for invitation acceptance';
comment on column public.team_invitations.expires_at is 'When the invitation expires';

comment on table public.team_projects is 'Many-to-many relationship between teams and projects';
comment on column public.team_projects.team_id is 'Reference to the team';
comment on column public.team_projects.project_id is 'Reference to the project';