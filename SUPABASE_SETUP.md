# Supabase Setup Guide

This guide will help you set up Supabase for authentication and database management in your portfolio application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your portfolio application cloned locally

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - Project name
   - Database password (save this securely!)
   - Region (choose one closest to your users)
4. Click "Create new project"
5. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. Go to your project's **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root of your project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Other existing variables
XAI_API_KEY=your_xai_api_key
```

Replace the placeholder values with your actual Supabase credentials.

## Step 4: Run Database Migrations

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the migration

This will create:
- `content_overrides` table for storing localized content
- `uploads` table for file metadata
- `uploads` storage bucket for file storage
- Row Level Security (RLS) policies
- Necessary indexes and triggers

## Step 5: Create Your Admin User

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter your admin email and password
4. Click **Create user**
5. Confirm the user's email (in production, this would be done via email)

## Step 6: Test the Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:3000/admin/login`
4. Log in with your admin credentials
5. You should be redirected to the admin dashboard

## Database Schema

### content_overrides Table

Stores localized content overrides:

| Column      | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| id          | UUID      | Primary key                           |
| locale      | VARCHAR   | Language code (e.g., 'en', 'es')     |
| content     | JSONB     | Content data in JSON format           |
| created_at  | TIMESTAMP | Creation timestamp                    |
| updated_at  | TIMESTAMP | Last update timestamp                 |
| updated_by  | UUID      | Reference to user who updated         |

### uploads Table

Tracks uploaded files:

| Column            | Type    | Description                      |
|-------------------|---------|----------------------------------|
| id                | UUID    | Primary key                      |
| filename          | VARCHAR | Unique filename                  |
| original_filename | VARCHAR | Original uploaded filename       |
| mime_type         | VARCHAR | File MIME type                   |
| size_bytes        | BIGINT  | File size in bytes               |
| storage_path      | TEXT    | Path in storage bucket           |
| uploaded_by       | UUID    | Reference to uploading user      |
| created_at        | TIMESTAMP | Upload timestamp               |

## Row Level Security (RLS)

The schema includes RLS policies that:

- Allow public read access to content and uploads
- Require authentication for creating/updating content
- Require authentication for uploading files
- Allow authenticated users to delete their own uploads

## Storage Buckets

The migration creates an `uploads` bucket with policies that:

- Allow public read access for serving files
- Require authentication for uploading files
- Allow authenticated users to delete their own files

## Migrating Existing Data

If you have existing content in `data/content-overrides.json`, you can migrate it:

1. Read the JSON file
2. For each locale, insert a row into `content_overrides`:
   ```sql
   INSERT INTO content_overrides (locale, content)
   VALUES ('en', '{"your": "json", "content": "here"}');
   ```

## Authentication Flow

1. User navigates to `/admin/login`
2. User enters email and password
3. Supabase Auth validates credentials
4. On success, Supabase sets session cookies
5. Middleware checks authentication on protected routes
6. User is redirected to `/admin` dashboard

## API Routes

### GET /api/content

Fetch content for a specific language or all languages.

**Query params:**
- `lang` (optional): Language code ('en', 'es')

**Response:**
```json
{
  "data": {
    "branding": {...},
    "hero": {...},
    ...
  }
}
```

### PUT /api/content

Update content for a specific language (requires authentication).

**Body:**
```json
{
  "lang": "en",
  "content": {
    "hero": {
      "headline": "Updated headline"
    }
  }
}
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use Row Level Security** on all tables
3. **Rotate API keys** regularly
4. **Enable email confirmation** for production
5. **Use strong passwords** for admin accounts
6. **Monitor authentication logs** in Supabase dashboard
7. **Set up backups** for your database

## Troubleshooting

### "Invalid API key" error

- Verify your environment variables are set correctly
- Make sure you're using the **anon/public** key, not the service role key
- Restart your development server after changing `.env.local`

### Authentication not working

- Check that you've created a user in Supabase Auth
- Verify the user's email is confirmed
- Check browser console for errors
- Verify middleware is running (check console logs)

### Database queries failing

- Verify RLS policies are created correctly
- Check that you're authenticated when making writes
- Review Supabase logs in the dashboard

### Content not saving

- Check that the `content_overrides` table exists
- Verify you're authenticated
- Check browser network tab for API errors
- Review Supabase logs for database errors

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

## Support

If you encounter issues:

1. Check the Supabase dashboard logs
2. Review browser console errors
3. Check the GitHub issues for this project
4. Contact the maintainer
