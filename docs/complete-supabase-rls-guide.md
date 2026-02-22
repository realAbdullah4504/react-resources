# Complete Supabase Row Level Security (RLS) Guide

This comprehensive guide covers everything you need to know about Row Level Security in Supabase, from basic concepts to advanced implementations.

## Table of Contents

1. [What is Row Level Security?](#what-is-row-level-security)
2. [How RLS Works in Supabase](#how-rls-works-in-supabase)
3. [RLS Policy Types](#rls-policy-types)
4. [Policy Commands and Syntax](#policy-commands-and-syntax)
5. [Advanced RLS Patterns](#advanced-rls-patterns)
6. [RLS Functions and Operators](#rls-functions-and-operators)
7. [Performance Optimization](#performance-optimization)
8. [Testing and Debugging RLS](#testing-and-debugging-rls)
9. [Common RLS Use Cases](#common-rls-use-cases)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting Common Issues](#troubleshooting-common-issues)
12. [Real-World Examples](#real-world-examples)

## What is Row Level Security?

Row Level Security (RLS) is a PostgreSQL feature that enables fine-grained access control at the row level within database tables. Instead of controlling access at the table level, RLS allows you to define policies that determine which specific rows a user can read, update, or delete.

### Key Concepts

**Row-Level Control:** Unlike traditional database permissions that operate at the table level, RLS works at the individual row level.

**Policy-Based:** Access is controlled through policies that are evaluated for each query.

**Automatic Enforcement:** Once enabled, RLS is automatically enforced by the database engine.

**Context-Aware:** Policies can use session information like user ID, roles, and custom claims.

### Benefits of RLS

- **Data Isolation:** Users can only access their own data
- **Simplified Application Logic:** Move security logic to the database layer
- **Reduced Attack Surface:** Security is enforced at the lowest level
- **Multi-Tenancy:** Easy implementation of multi-tenant applications
- **Compliance:** Helps meet data protection regulations (GDPR, HIPAA, etc.)

## How RLS Works in Supabase

### Authentication Context

Supabase automatically provides authentication context through several functions:

```sql
-- Get current user ID
auth.uid() -- Returns UUID of authenticated user

-- Get current user's email
auth.email() -- Returns email of authenticated user

-- Get JWT claims
auth.jwt() -> JSONB -- Returns all JWT claims

-- Check if user is authenticated
auth.role() -- Returns 'authenticated' or 'anon'
```

### RLS Evaluation Process

1. **Query Received:** Database receives a SQL query
2. **RLS Check:** If RLS is enabled on the target table, policies are evaluated
3. **Policy Application:** Each row is checked against applicable policies
4. **Result Filtering:** Only rows passing policy checks are returned/modified

### Enabling RLS

```sql
-- Enable RLS on a table
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Disable RLS on a table
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;

-- Check RLS status
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'your_table';
```

## RLS Policy Types

### SELECT Policies

Control who can read data from tables.

```sql
-- Basic SELECT policy
CREATE POLICY "Users can view own data"
ON your_table
FOR SELECT
USING (user_id = auth.uid());

-- Complex SELECT with multiple conditions
CREATE POLICY "Complex read policy"
ON your_table
FOR SELECT
USING (
  user_id = auth.uid() 
  OR status = 'public'
  OR auth.jwt() ->> 'role' = 'admin'
);
```

### INSERT Policies

Control who can add new rows to tables.

```sql
-- Basic INSERT policy
CREATE POLICY "Users can insert own data"
ON your_table
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- INSERT with validation
CREATE POLICY "Valid data insertion"
ON your_table
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND status IN ('draft', 'published')
  AND created_at = NOW()
);
```

### UPDATE Policies

Control who can modify existing rows.

```sql
-- Basic UPDATE policy
CREATE POLICY "Users can update own data"
ON your_table
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- UPDATE with restrictions
CREATE POLICY "Limited update policy"
ON your_table
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND status != 'archived'
  AND updated_at = NOW()
);
```

### DELETE Policies

Control who can remove rows from tables.

```sql
-- Basic DELETE policy
CREATE POLICY "Users can delete own data"
ON your_table
FOR DELETE
USING (user_id = auth.uid());

-- DELETE with conditions
CREATE POLICY "Conditional delete policy"
ON your_table
FOR DELETE
USING (
  user_id = auth.uid()
  AND status = 'draft'
  AND created_at < NOW() - INTERVAL '30 days'
);
```

### ALL Policies

Apply to all operations (SELECT, INSERT, UPDATE, DELETE).

```sql
-- ALL policy for simple cases
CREATE POLICY "Users can manage own data"
ON your_table
FOR ALL
USING (user_id = auth.uid());
```

## Policy Commands and Syntax

### Creating Policies

```sql
CREATE POLICY policy_name
ON table_name
[ FOR { SELECT | INSERT | UPDATE | DELETE | ALL } ]
[ TO { role_name | PUBLIC | CURRENT_USER | SESSION_USER } ]
[ USING ( using_expression ) ]
[ WITH CHECK ( check_expression ) ];
```

### Modifying Policies

```sql
-- Replace existing policy
CREATE OR REPLACE POLICY policy_name
ON table_name
FOR SELECT
USING (condition);

-- Alter policy name
ALTER POLICY old_name ON table_name RENAME TO new_name;
```

### Dropping Policies

```sql
-- Drop specific policy
DROP POLICY policy_name ON table_name;

-- Drop all policies on table
DROP POLICY ALL ON table_name;
```

### Viewing Policies

```sql
-- List all policies on a table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'your_table';

-- Get policy definitions
SELECT pg_get_viewdef('pg_policies', true);
```

## Advanced RLS Patterns

### Role-Based Access Control (RBAC)

```sql
-- Multi-level role system
CREATE POLICY "Role-based access"
ON sensitive_data
FOR SELECT
USING (
  -- Admin can see everything
  auth.jwt() ->> 'role' = 'admin'
  OR
  -- Manager can see department data
  (auth.jwt() ->> 'role' = 'manager' AND department = auth.jwt() ->> 'department')
  OR
  -- User can see own data
  (auth.jwt() ->> 'role' = 'user' AND user_id = auth.uid())
);
```

### Time-Based Access Control

```sql
-- Time-restricted access
CREATE POLICY "Business hours only"
ON operations
FOR ALL
USING (
  EXTRACT(HOUR FROM NOW()) BETWEEN 9 AND 17
  AND EXTRACT(DOW FROM NOW()) BETWEEN 1 AND 5
);

-- Expiration-based access
CREATE POLICY "Temporary access"
ON shared_resources
FOR SELECT
USING (
  expires_at IS NULL 
  OR expires_at > NOW()
);
```

### Hierarchical Data Access

```sql
-- Organization hierarchy access
CREATE POLICY "Hierarchical access"
ON employees
FOR SELECT
USING (
  -- Can see own record
  user_id = auth.uid()
  OR
  -- Can see direct reports
  manager_id = auth.uid()
  OR
  -- Can see department if department head
  department_id IN (
    SELECT department_id FROM departments 
    WHERE head_id = auth.uid()
  )
);
```

### Geographic Access Control

```sql
-- Location-based access
CREATE POLICY "Geographic restrictions"
ON location_data
FOR SELECT
USING (
  -- Allow access from same country
  country = (
    SELECT country FROM user_profiles 
    WHERE user_id = auth.uid()
  )
  OR
  -- Admin override
  auth.jwt() ->> 'role' = 'admin'
);
```

### Data Segmentation

```sql
-- Multi-tenant data isolation
CREATE POLICY "Tenant isolation"
ON tenant_data
FOR ALL
USING (
  tenant_id = (
    SELECT tenant_id FROM user_tenants 
    WHERE user_id = auth.uid()
  )
);
```

## RLS Functions and Operators

#### Options

- USING
- WITH CHECK
- EXISTS
- IN
- ANY
- ALL
- auth.uid()
- auth.jwt()
- How PostgreSQL evaluates RLS


### Authentication Functions

```sql
-- Get user information
auth.uid()           -- Current user UUID
auth.email()         -- Current user email
auth.role()          -- Current user role ('authenticated' or 'anon')
auth.jwt() ->> 'key' -- Access custom JWT claims

-- Example: Check custom claim
CREATE POLICY "Premium users only"
ON premium_content
FOR SELECT
USING (auth.jwt() ->> 'subscription' = 'premium');
```

### Useful Operators

```sql
-- Array operations
user_id = ANY(allowed_users)           -- User in allowed array
auth.jwt() ?| array['admin', 'moderator']  -- User has any of these roles

-- JSON operations
auth.jwt() @> '{"role": "admin"}'     -- JSON contains
auth.jwt() ->> 'department' = 'sales'  -- JSON field access

-- Temporal operations
created_at > NOW() - INTERVAL '30 days'  -- Recent data
valid_from <= NOW() AND valid_to >= NOW()  -- Valid time range

-- String operations
email LIKE '%@company.com'             -- Domain filtering
UPPER(name) = UPPER(search_term)      -- Case-insensitive compare
```

### Custom Functions in Policies

```sql
-- Create helper function
CREATE OR REPLACE FUNCTION is_manager(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = is_manager.user_id 
    AND role = 'manager'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policy
CREATE POLICY "Manager access"
ON projects
FOR ALL
USING (is_manager(auth.uid()) OR user_id = auth.uid());
```

## Performance Optimization

### Indexing Strategy

```sql
-- Index columns used in RLS policies
CREATE INDEX idx_user_id ON your_table(user_id);
CREATE INDEX idx_tenant_id ON your_table(tenant_id);
CREATE INDEX idx_status ON your_table(status);

-- Composite indexes for complex policies
CREATE INDEX idx_user_status ON your_table(user_id, status);
CREATE INDEX idx_tenant_created ON your_table(tenant_id, created_at);

-- Partial indexes for specific conditions
CREATE INDEX idx_active_users ON your_table(user_id) 
WHERE status = 'active';
```

### Policy Optimization

```sql
-- Efficient: Use indexed columns first
CREATE POLICY "Optimized policy"
ON your_table
FOR SELECT
USING (
  user_id = auth.uid()  -- Indexed column first
  AND status = 'active' -- Additional conditions
);

-- Less efficient: Complex expressions first
CREATE POLICY "Less optimized"
ON your_table
FOR SELECT
USING (
  UPPER(name) LIKE UPPER(search_term)  -- Expensive operation first
  AND user_id = auth.uid()
);
```

### Query Optimization

```sql
-- Use EXISTS instead of IN for subqueries
CREATE POLICY "Using EXISTS"
ON tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE id = tasks.project_id 
    AND user_id = auth.uid()
  )
);

-- Avoid correlated subqueries when possible
CREATE POLICY "Optimized join"
ON tasks
FOR SELECT
USING (
  tasks.project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);
```

## Testing and Debugging RLS

### Testing with Different Users

```sql
-- Set current user context
SET request.jwt.claim.sub = 'user-uuid-here';
SET request.jwt.claim.email = 'user@example.com';
SET request.jwt.claim.role = 'user';

-- Test queries
SELECT * FROM your_table;

-- Reset context
RESET request.jwt.claim.sub;
RESET request.jwt.claim.email;
RESET request.jwt.claim.role;
```

### Policy Debugging

```sql
-- Check which policies apply
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'your_table';

-- Test policy conditions directly
SELECT 
  user_id = auth.uid() as passes_user_check,
  status = 'active' as passes_status_check
FROM your_table
LIMIT 1;

-- Use EXPLAIN to see policy impact
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM your_table WHERE user_id = auth.uid();
```

### Common Debugging Techniques

```sql
-- Temporarily disable RLS for testing
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
-- Run your query
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create test policy that always allows
CREATE POLICY "Debug - Allow All"
ON your_table
FOR ALL
USING (true)
WITH CHECK (true);

-- Use logging functions
CREATE POLICY "Debug policy"
ON your_table
FOR SELECT
USING (
  CASE 
    WHEN user_id = auth.uid() THEN true
    ELSE 
      (RAISE NOTICE 'Access denied for user % on row %', auth.uid(), id)::boolean
  END
);
```

## Common RLS Use Cases

### Multi-Tenant SaaS Applications

```sql
-- Tenant isolation
CREATE POLICY "Tenant data isolation"
ON tenant_data
FOR ALL
USING (tenant_id = auth.jwt() ->> 'tenant_id'::UUID);

-- Shared resources with tenant access
CREATE POLICY "Shared resource access"
ON shared_resources
FOR SELECT
USING (
  tenant_id IS NULL  -- Public resources
  OR tenant_id = auth.jwt() ->> 'tenant_id'::UUID
);
```

### Social Media Applications

```sql
-- Post visibility
CREATE POLICY "Post visibility"
ON posts
FOR SELECT
USING (
  -- Own posts
  user_id = auth.uid()
  OR
  -- Public posts
  visibility = 'public'
  OR
  -- Friends' posts
  user_id IN (
    SELECT friend_id FROM friendships 
    WHERE user_id = auth.uid() AND status = 'accepted'
  )
);

-- Comment permissions
CREATE POLICY "Comment permissions"
ON comments
FOR INSERT
WITH CHECK (
  post_id IN (
    SELECT id FROM posts 
    WHERE user_id = auth.uid() 
    OR visibility = 'public'
  )
);
```

### Healthcare Applications

```sql
-- Patient data access
CREATE POLICY "Healthcare data access"
ON patient_records
FOR SELECT
USING (
  -- Patient can see own records
  patient_id = auth.uid()
  OR
  -- Doctors can see their patients' records
  doctor_id IN (
    SELECT doctor_id FROM doctor_patient_assignments 
    WHERE patient_id = patient_records.patient_id 
    AND doctor_id = auth.uid()
  )
  OR
  -- Admin access
  auth.jwt() ->> 'role' = 'admin'
);
```

### Educational Platforms

```sql
-- Course access
CREATE POLICY "Course enrollment access"
ON course_materials
FOR SELECT
USING (
  -- Public courses
  is_public = true
  OR
  -- Enrolled students
  course_id IN (
    SELECT course_id FROM enrollments 
    WHERE student_id = auth.uid() 
    AND status = 'active'
  )
  OR
  -- Course instructors
  instructor_id = auth.uid()
);
```

## Security Best Practices

### Policy Design Principles

```sql
-- 1. Principle of Least Privilege
CREATE POLICY "Minimal access"
ON sensitive_data
FOR SELECT
USING (user_id = auth.uid());  -- Only what's necessary

-- 2. Defense in Depth
CREATE POLICY "Primary access control"
ON data
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Secondary validation"
ON data
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND status IN ('valid_statuses')
  AND created_at <= NOW()
);

-- 3. Fail Securely
CREATE POLICY "Secure by default"
ON critical_data
FOR ALL
USING (false);  -- Explicitly deny, then add specific allows
```

### Input Validation

```sql
-- Validate data structure
CREATE POLICY "Valid data structure"
ON structured_data
FOR INSERT
WITH CHECK (
  jsonb_typeof(data) = 'object'
  AND data ? 'required_field'
  AND data->>'status' IN ('active', 'inactive')
);

-- Prevent SQL injection in policies
CREATE POLICY "Safe string operations"
ON user_searches
FOR SELECT
USING (
  user_id = auth.uid()
  AND search_term ~* '^[a-zA-Z0-9\s]+$'  -- Regex validation
);
```

### Audit and Monitoring

```sql
-- Create audit table
CREATE TABLE rls_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID NOT NULL,
  row_id UUID,
  policy_used TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details JSONB
);

-- Audit policy
CREATE POLICY "Audit access"
ON sensitive_data
FOR ALL
USING (
  (
    INSERT INTO rls_audit (table_name, operation, user_id, row_id, policy_used)
    VALUES ('sensitive_data', current_setting('rls.operation'), auth.uid(), id, current_setting('rls.policy'))
  ) IS NOT NULL
  AND user_id = auth.uid()
);
```

## Troubleshooting Common Issues

### Permission Denied Errors

```sql
-- Issue: "permission denied for relation"
-- Solution: Check if RLS is enabled and policies exist

SELECT 
  relname, 
  relrowsecurity,
  relhasrules
FROM pg_class 
WHERE relname = 'your_table';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

### Performance Issues

```sql
-- Issue: Slow queries with RLS
-- Solution: Analyze query plan with RLS

EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT * FROM your_table WHERE condition;

-- Check for missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'your_table';
```

### Policy Conflicts

```sql
-- Issue: Conflicting policies
-- Solution: Understand permissive vs restrictive policies

-- Permissive policies (default): Any matching policy allows access
CREATE POLICY "Permissive policy 1" ON table FOR SELECT USING (condition1);
CREATE POLICY "Permissive policy 2" ON table FOR SELECT USING (condition2);

-- Restrictive policies: All restrictive policies must allow access
CREATE POLICY "Restrictive policy" ON table FOR SELECT 
USING (condition) WITH CHECK (condition) AS RESTRICTIVE;
```

### JWT Issues

```sql
-- Issue: auth.uid() returns NULL
-- Solution: Check JWT configuration

-- View current JWT claims
SELECT current_setting('request.jwt.claim', true);

-- Test JWT parsing
SELECT 
  auth.uid(),
  auth.email(),
  auth.role(),
  auth.jwt();
```

## Real-World Examples

### E-commerce Platform

```sql
-- Product visibility
CREATE POLICY "Product access"
ON products
FOR SELECT
USING (
  status = 'published'
  OR (
    status = 'draft' 
    AND seller_id = auth.uid()
  )
);

-- Order management
CREATE POLICY "Order access"
ON orders
FOR ALL
USING (
  customer_id = auth.uid()
  OR
  auth.jwt() ->> 'role' IN ('admin', 'support')
);

-- Inventory management
CREATE POLICY "Inventory updates"
ON inventory
FOR UPDATE
USING (seller_id = auth.uid())
WITH CHECK (
  seller_id = auth.uid()
  AND quantity >= 0
  AND updated_at = NOW()
);
```

### Project Management Tool

```sql
-- Project access
CREATE POLICY "Project access"
ON projects
FOR SELECT
USING (
  owner_id = auth.uid()
  OR id IN (
    SELECT project_id FROM project_members 
    WHERE user_id = auth.uid()
  )
);

-- Task permissions
CREATE POLICY "Task management"
ON tasks
FOR ALL
USING (
  project_id IN (
    SELECT id FROM projects 
    WHERE owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM project_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- File attachments
CREATE POLICY "File access"
ON attachments
FOR SELECT
USING (
  project_id IN (
    SELECT id FROM projects 
    WHERE owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM project_members 
      WHERE user_id = auth.uid()
    )
  )
);
```

### Content Management System

```sql
-- Content visibility
CREATE POLICY "Content access"
ON content
FOR SELECT
USING (
  published = true
  OR (
    published = false 
    AND author_id = auth.uid()
  )
  OR
  auth.jwt() ->> 'role' = 'editor'
);

-- Content editing
CREATE POLICY "Content editing"
ON content
FOR UPDATE
USING (
  author_id = auth.uid()
  OR auth.jwt() ->> 'role' = 'editor'
)
WITH CHECK (
  author_id = auth.uid()
  OR auth.jwt() ->> 'role' = 'editor'
);

-- Content approval workflow
CREATE POLICY "Content approval"
ON content
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'editor')
WITH CHECK (
  status = 'approved'
  AND approved_by = auth.uid()
  AND approved_at = NOW()
);
```

## Conclusion

Row Level Security is a powerful feature that provides robust, database-level security for your applications. By understanding the concepts, patterns, and best practices outlined in this guide, you can implement secure, scalable, and maintainable access control systems.

Remember that RLS is just one layer of security. Always combine it with:

- Proper authentication and authorization
- Input validation and sanitization
- Secure coding practices
- Regular security audits
- Monitoring and logging

With RLS properly implemented, you can build applications that are both secure and performant, with data access control enforced at the most fundamental level.
