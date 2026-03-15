#!/bin/bash
# =============================================================================
# Songkran Online - Production Deployment Script
# Usage: bash deploy.sh
# =============================================================================

set -e

APP_DIR="/var/www/songkran-online"
REPO_URL="git@github.com:Freelance-Project-Team/songkran-online.git"
BRANCH="main"

echo "Starting deployment..."

# ─── Pull latest code ────────────────────────────────────────────────────────
cd "$APP_DIR"
echo "Pulling latest code from $BRANCH..."
git fetch origin
git reset --hard "origin/$BRANCH"

# ─── Install & Build Frontend ────────────────────────────────────────────────
echo "Building frontend..."
cd "$APP_DIR/songkran-online-client"
npm ci --production=false
npm run build

# ─── Install Backend Dependencies ────────────────────────────────────────────
echo "Installing backend dependencies..."
cd "$APP_DIR/songkran-online-api"
npm ci --production

# ─── Restart PM2 Processes ───────────────────────────────────────────────────
echo "Restarting PM2 processes..."
cd "$APP_DIR"
pm2 reload ecosystem.config.js --env production

echo "Deployment complete!"
pm2 status
