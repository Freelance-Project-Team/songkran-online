#!/bin/bash
# =============================================================================
# Songkran Online - Backend Deployment Script (Lightnode)
# Frontend is deployed via Vercel separately
# Usage: bash deploy.sh
# =============================================================================

set -e

APP_DIR="/var/www/songkran-online"
BRANCH="main"

echo "🚀 Starting backend deployment..."

# ─── Pull latest code ────────────────────────────────────────────────────────
cd "$APP_DIR"
echo "📥 Pulling latest code from $BRANCH..."
git fetch origin
git reset --hard "origin/$BRANCH"

# ─── Install Backend Dependencies ────────────────────────────────────────────
echo "📦 Installing backend dependencies..."
cd "$APP_DIR/songkran-online-api"
npm ci

# ─── Prisma: Generate Client & Run Migrations ────────────────────────────────
echo "🔄 Running Prisma generate & migrate..."
npx prisma generate --schema src/shared/prisma/schema.prisma
npx prisma migrate deploy --schema src/shared/prisma/schema.prisma

# ─── Build TypeScript ─────────────────────────────────────────────────────────
echo "🔨 Building TypeScript..."
npm run build

# ─── Restart PM2 Processes ───────────────────────────────────────────────────
echo "♻️  Restarting PM2..."
cd "$APP_DIR"
pm2 reload ecosystem.config.js --env production

echo "✅ Backend deployment complete!"
pm2 status
