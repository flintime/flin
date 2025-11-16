# RLS Policy for Admin Vendor Creation

To allow admins to create vendors without using the service role key, you need to create a Row Level Security (RLS) policy in Supabase.

## SQL Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on vendors table (if not already enabled)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to insert vendors
CREATE POLICY "Admins can insert vendors"
ON vendors
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create policy to allow admins to update vendors
CREATE POLICY "Admins can update vendors"
ON vendors
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create policy to allow admins to delete vendors
CREATE POLICY "Admins can delete vendors"
ON vendors
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create policy to allow admins to select all vendors
CREATE POLICY "Admins can select all vendors"
ON vendors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

## How It Works

1. The API route verifies the user is an admin (server-side check)
2. Creates a Supabase client using the admin's authenticated session
3. The RLS policy checks if the user has `is_admin = true` in their profile
4. If the check passes, the insert is allowed

## Benefits

- ✅ No service role key needed
- ✅ RLS policies enforced at database level
- ✅ More secure - follows principle of least privilege
- ✅ Service role key never exposed, even server-side

## Testing

After creating the policies, test by:
1. Logging in as an admin user
2. Creating a vendor through the admin interface
3. Verifying the vendor is created successfully

