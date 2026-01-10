#!/bin/bash

# Marketing OS - Database Setup Script
# Run this on your LOCAL machine (not in Claude Code environment)

echo "🚀 Marketing OS - Database Setup"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file first"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Pushing database schema to Supabase..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run dev"
    echo "2. Visit: http://localhost:3000"
    echo "3. Sign in with Google"
    echo "4. Run: npx prisma studio"
    echo "5. Set your user role to ADMIN"
    echo ""
else
    echo ""
    echo "❌ Database setup failed"
    echo ""
    echo "Troubleshooting:"
    echo "- Check your DATABASE_URL in .env"
    echo "- Verify Supabase project is active"
    echo "- Try: npx prisma db push --accept-data-loss"
    echo ""
    exit 1
fi
