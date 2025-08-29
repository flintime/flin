# Environment Variables Setup

This document outlines the required environment variables for the Flin website.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# LocationIQ API Key (Required for address autocomplete and geocoding)
LOCATIONIQ_API_KEY=your_locationiq_api_key
```

## Setup Instructions

### 1. Supabase Configuration
1. Go to [supabase.com](https://supabase.com) and create a project
2. In your project settings, find the API settings
3. Copy your Project URL and Anon (public) key
4. Add them to your `.env.local` file

### 2. LocationIQ API Key
1. Sign up at [locationiq.com](https://locationiq.com/)
2. Choose a plan (free tier: 5,000 requests/day)
3. Copy your API key from the dashboard
4. Add it to your `.env.local` file

## Example .env.local File

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
LOCATIONIQ_API_KEY=pk_your_api_key_here
```

## Development vs Production

- **Development**: Use `.env.local` file
- **Production**: Set environment variables in your hosting platform:
  - **Vercel**: Project Settings → Environment Variables
  - **Netlify**: Site Settings → Build & Deploy → Environment Variables
  - **Railway**: Variables tab in your project

## Security Notes

- Never commit `.env.local` files to version control
- Keep your API keys secure and don't share them publicly
- Use different API keys for development and production environments
