# Supabase Row Level Security (RLS) Tutorial

This document explains all the Row Level Security (RLS) policies implemented in our Supabase database for the task management application.

## Table of Contents

1. [What is RLS?](#what-is-rls)
2. [Database Schema](#database-schema)
3. [RLS Policies Overview](#rls-policies-overview)
4. [Profiles Table RLS](#profiles-table-rls)
5. [Projects Table RLS](#projects-table-rls)
6. [Tasks Table RLS](#tasks-table-rls)
7. [Storage RLS](#storage-rls)
8. [Testing RLS Policies](#testing-rls-policies)
9. [Common Issues & Solutions](#common-issues--solutions)

## What is RLS?

Row Level Security (RLS) is a PostgreSQL feature that allows you to define policies that control who can access, modify, or delete specific rows in a table. In Supabase, RLS is essential for building secure multi-tenant applications.

**Key Benefits:**
- Data isolation between users
- Fine-grained access control
- Automatic security enforcement at the database level
- No need for application-level security checks

## Database Schema

Our application uses three main tables:

```sql
-- Profiles table (user information)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'member',
  created_at timestamp with time zone default now()
);

-- Projects table (user projects)
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Tasks table (project tasks)
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
```

## RLS Policies Overview

All tables have RLS enabled:

```sql
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
```

## Profiles Table RLS

### 1. Users can view their own profile

```sql
create policy "Users can view their own profile"
on public.profiles
for select
using ( auth.uid() = id );
```

**Purpose:** Allows users to see their own profile information.
**How it works:** `auth.uid()` returns the current authenticated user's ID, which must match the profile's `id`.

### 2. Users can update their own profile

```sql
create policy "Users can update their own profile"
on public.profiles
for update
using ( auth.uid() = id );
```

**Purpose:** Allows users to modify their own profile information.
**How it works:** Users can only update rows where their ID matches the profile's `id`.

### 3. Users can insert their own profile

```sql
create policy "Users can insert their own profile"
on public.profiles
for insert
with check ( auth.uid() = id );
```

**Purpose:** Allows users to create their own profile during signup.
**How it works:** Users can only insert profiles where the `id` matches their authenticated user ID.

### 4. Admins can view all profiles

```sql
create policy "Admins can view all profiles via profile table"
on public.profiles
for select
using (
    auth.uid() = id  -- normal user sees their own row
    OR (select role from public.profiles where id = auth.uid()) = 'admin'
);
```

**Purpose:** Allows administrators to view all user profiles.
**How it works:** 
- Normal users see only their own profile (`auth.uid() = id`)
- Admins see all profiles (subquery checks if current user's role is 'admin')

## Projects Table RLS

### Users can manage their own projects

```sql
create policy "Users can manage their own projects"
on public.projects
for all
using ( auth.uid() = user_id );
```

**Purpose:** Users have full CRUD access to their own projects.
**How it works:** `auth.uid()` must match the project's `user_id` field.
**Operations covered:** SELECT, INSERT, UPDATE, DELETE

## Tasks Table RLS

### Users can manage tasks of their projects

```sql
create policy "Users can manage tasks of their projects"
on public.tasks
for all
using (
  auth.uid() in (
    select user_id from public.projects
    where id = project_id
  )
);
```

**Purpose:** Users can only access tasks belonging to their projects.
**How it works:** 
1. The policy checks if the current user's ID (`auth.uid()`) is in the list of `user_id`s from projects
2. It joins with the projects table to verify ownership
3. Users can only access tasks where they own the parent project

## Storage RLS

### Avatar Storage Bucket

```sql
-- Create storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);
```

### 1. Users can upload their own avatar

```sql
create policy "Users can upload their own avatar"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
```

**Purpose:** Users can only upload avatars to their own folder.
**How it works:** 
- Files must be in the 'avatars' bucket
- The folder name must match the user's ID
- File path format: `user_id/filename.jpg`

### 2. Users can read avatars

```sql
create policy "Users can read avatars"
on storage.objects
for select
using ( bucket_id = 'avatars' );
```

**Purpose:** All users can view avatars (public access).
**How it works:** Anyone can read files from the 'avatars' bucket.

## Testing RLS Policies

### Testing as a Regular User

```sql
-- Set the current user (simulate authentication)
SET request.jwt.claim.sub = 'user-uuid-here';

-- Test: Can only see own profile
SELECT * FROM profiles; -- Should return only your row

-- Test: Can only see own projects
SELECT * FROM projects; -- Should return only your projects

-- Test: Can only see tasks from your projects
SELECT * FROM tasks; -- Should return tasks from your projects only
```

### Testing as an Admin

```sql
-- Set the current admin user
SET request.jwt.claim.sub = 'admin-user-uuid-here';

-- Test: Can see all profiles
SELECT * FROM profiles; -- Should return all profiles

-- Test: Can only see own projects (admin doesn't get special project access)
SELECT * FROM projects; -- Should return only admin's projects
```

## Common Issues & Solutions

### Issue 1: "New row violates row-level security policy"

**Cause:** Trying to insert data that doesn't satisfy the `with check` condition.

**Solution:** Ensure the data meets the policy requirements:
```sql
-- Correct: Insert with matching user_id
INSERT INTO projects (name, user_id) 
VALUES ('My Project', auth.uid());

-- Incorrect: Insert with wrong user_id
INSERT INTO projects (name, user_id) 
VALUES ('My Project', 'other-user-id');
```

### Issue 2: "Permission denied for relation"

**Cause:** RLS is enabled but no policy allows the operation.

**Solution:** Add appropriate policies or disable RLS for testing:
```sql
-- Disable RLS (for testing only)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Issue 3: Complex policies causing performance issues

**Cause:** Subqueries in policies can be slow with large datasets.

**Solution:** Use indexes and optimize queries:
```sql
-- Add index for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
```

### Issue 4: Role-based access not working

**Cause:** Role field not properly set or checked.

**Solution:** Ensure role is set during signup:
```sql
-- Check current user's role
SELECT role FROM profiles WHERE id = auth.uid();

-- Update user role to admin
UPDATE profiles SET role = 'admin' WHERE id = 'user-uuid';
```

## Best Practices

1. **Always use RLS** on user data tables
2. **Test policies** with different user roles
3. **Use indexes** on columns referenced in policies
4. **Keep policies simple** and well-documented
5. **Use `auth.uid()`** instead of passing user IDs from the client
6. **Implement proper error handling** for permission denied cases
7. **Regularly audit** policies for security gaps

## Security Considerations

- **Never disable RLS** in production
- **Validate all inputs** even with RLS enabled
- **Use HTTPS** to prevent token interception
- **Implement proper JWT** validation
- **Monitor access patterns** for suspicious activity
- **Regular security audits** of RLS policies

## Conclusion

RLS provides a powerful, database-level security layer that ensures data isolation and proper access control. By implementing these policies correctly, we create a secure multi-tenant application where users can only access their own data, while administrators have the necessary oversight capabilities.

Remember: RLS is your first line of defense, but should be complemented with proper application-level validation and security practices.
