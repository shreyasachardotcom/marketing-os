# Marketing OS - Local Setup Guide

The current environment has network restrictions preventing direct database access. Follow these steps to set up on **your local machine**:

## Quick Setup (Recommended)

1. **Open your terminal** (on your local machine, not in Claude Code)

2. **Navigate to the project**:
   ```bash
   cd /path/to/marketing-os
   ```

3. **Run the setup script**:
   ```bash
   ./setup-database.sh
   ```

That's it! The script will:
- Install all dependencies
- Push the database schema to Supabase
- Give you next steps

---

## Manual Setup (Alternative)

If the script doesn't work, run these commands manually:

### 1. Install Dependencies
```bash
npm install
```

### 2. Push Database Schema
```bash
npx prisma db push
```

### 3. Start the Application
```bash
npm run dev
```

### 4. Visit the App
Open http://localhost:3000 in your browser

### 5. Sign in with Google
Click "Get Started" and sign in with your Google account

### 6. Make Yourself Admin
```bash
npx prisma studio
```
- Click on "User" table
- Find your user record
- Change `role` from `TEAM_MEMBER` to `ADMIN`
- Click "Save"
- Refresh the app

---

## Troubleshooting

### Database Connection Issues

**Problem**: `Can't reach database server`

**Solutions**:
1. Check your Supabase project is active (not paused)
2. Verify `.env` file has correct `DATABASE_URL`
3. Try with the Session pooler connection string:
   ```
   DATABASE_URL="postgresql://postgres.czjxthzcyynpdarrcdhb:Supabase%401311@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
   ```

### Google OAuth Issues

**Problem**: OAuth error when signing in

**Solution**: Verify in Google Cloud Console that:
- Redirect URI is set to: `http://localhost:3000/api/auth/callback/google`
- OAuth credentials are correct in `.env`

### Missing Environment Variables

Run this to check:
```bash
cat .env
```

Should contain:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

---

## What's Already Configured

✅ `.env` file with your credentials
✅ Database connection string (Supabase)
✅ Google OAuth credentials
✅ All dependencies listed in `package.json`
✅ Prisma schema with all tables

---

## Next Steps After Setup

1. **Test the app** - Create a project and task
2. **Explore features** - Kanban board, Calendar, Team view
3. **Deploy to Vercel** (optional) - See README.md for instructions
4. **Invite your team** - Share the URL after deployment

---

## Need Help?

- Check the main README.md for detailed documentation
- Review Supabase connection strings in your dashboard
- Ensure all environment variables are set correctly
