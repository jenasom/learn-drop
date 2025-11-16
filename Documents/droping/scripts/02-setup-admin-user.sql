-- Create admin user for authentication
-- IMPORTANT: Run this script in your Supabase SQL editor
-- After running, you'll create the actual auth user in Supabase Auth dashboard

-- This script is informational. To create an admin user:
-- 1. Go to your Supabase project dashboard
-- 2. Click on "Authentication" in the left sidebar
-- 3. Click "Users"
-- 4. Click "Create new user"
-- 5. Enter your email and password
-- 6. Make sure "Auto Confirm User" is checked
-- 7. Click "Create user"

-- Now you can log in to /admin/login with your credentials!

-- Optional: Create a profile table to track admin users (for future multi-admin support)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = id);
