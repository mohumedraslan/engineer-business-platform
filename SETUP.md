# Engineer Business Platform Setup Guide

## 🚨 Current Issue: "Could not create user profile"

This error occurs because the application is not properly connected to Supabase or the database schema is not set up.

## 🔧 Step-by-Step Fix

### 1. Create Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To get these values:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

### 2. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Click "Run" to execute the SQL

**Important:** This creates the `profiles` table that the registration process needs.

### 3. Fix RLS Policy Issues (IMPORTANT!)

If you get the error "infinite recursion detected in policy for relation 'profiles'", you need to fix the RLS policies:

1. In your Supabase SQL Editor, run the contents of `fix-rls-policies.sql`
2. This removes the problematic circular references in the policies
3. The fixed policies allow users to create their own profiles without recursion

**Why this happens:** The original policies had circular references where checking permissions required checking the same table, causing infinite loops.

### 4. Test Database Connection

After setting up, you can test the connection by calling the test function:

```typescript
// In your browser console or a test component
const result = await fetch('/api/test-db', { method: 'POST' });
const data = await result.json();
console.log(data);
```

### 5. Verify RLS Policies

The database schema includes Row Level Security (RLS) policies. Make sure these are properly set up:

- Users can create their own profiles
- Users can view approved profiles
- Users can update their own profiles
- No circular references in policies

## 🔍 Troubleshooting

### Common Issues:

1. **"relation 'profiles' does not exist"**
   - Solution: Run the database schema SQL

2. **"infinite recursion detected in policy"** ⚠️ **NEW ISSUE**
   - Solution: Run `fix-rls-policies.sql` to fix circular references

3. **"permission denied"**
   - Solution: Check RLS policies and user permissions

4. **"Missing environment variables"**
   - Solution: Create `.env.local` file with correct values

5. **"foreign key constraint"**
   - Solution: Ensure auth.users table exists (should be automatic)

### Debug Steps:

1. Check browser console for detailed error messages
2. Check server logs for backend errors
3. Verify Supabase project is active and not paused
4. Ensure database is not in maintenance mode
5. Use the "Test Database Connection" button in the registration form

## 📱 Testing Registration

After setup:

1. Start your development server: `npm run dev`
2. Navigate to `/register`
3. Click "Test Database Connection" first
4. If successful, try registering
5. Check browser console and server logs for any errors

## 🆘 Still Having Issues?

If the problem persists:

1. Check the detailed error message in the browser console
2. Verify your Supabase project settings
3. Ensure you're using the correct API keys
4. Check if your Supabase project has any usage limits
5. Run the RLS policy fix script if you see recursion errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Policy Best Practices](https://supabase.com/docs/guides/auth/row-level-security#best-practices)
