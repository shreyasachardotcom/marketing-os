# Marketing OS

A minimal, transparent project management tool built specifically for Plum's 50-person marketing team.

## Features

- **Projects & Tasks**: Complete task management with stages (Backlog → To Do → In Progress → Creator Review → Reviewer Review → Done/Deferred)
- **Kanban Board**: Visual drag-and-drop task management
- **Calendar View**: Team-wide visibility of deadlines
- **Team Transparency**: View everyone's workload
- **Requisitions**: Non-marketing teams can request work
- **Team Notes**: Wiki-style knowledge base with real-time collaboration
- **Google OAuth**: Secure authentication via Google Workspace

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Rich Text**: Tiptap editor
- **Drag & Drop**: @hello-pangea/dnd
- **Real-time**: Yjs + y-websocket
- **Notifications**: Slack API integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Slack Bot Token (for notifications)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd marketing-os
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`: From Slack API

4. Initialize the database:
```bash
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Database Setup

The application uses PostgreSQL. You can use:
- **Local PostgreSQL**: Install PostgreSQL locally
- **Supabase**: Free tier PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

After setting up your database, update the `DATABASE_URL` in `.env` and run:

```bash
npx prisma migrate dev
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

## Slack Integration Setup

1. Go to [Slack API](https://api.slack.com/apps)
2. Create a new app
3. Add Bot Token Scopes: `chat:write`, `users:read`
4. Install app to workspace
5. Copy Bot Token and Signing Secret to `.env`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`

## User Roles

- **Admin**: Full access, user management (2-3 people)
- **Team Member**: Full access to projects, tasks, notes
- **Requisitioner**: Can only submit requisitions

Default role is Team Member. Admins must be set via database.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Project Structure

```
marketing-os/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript types
```

## Support

For issues or questions, please contact the development team.

## License

Proprietary - Plum Marketing Team
