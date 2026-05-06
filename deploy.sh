#!/usr/bin/env bash
# ── Vonix Code Camp — VPS Deployment Script ───────────────────────────────────
# Run on the VPS as root: bash deploy.sh
# Assumes: Ubuntu/Debian, Node.js 14+ installed, PostgreSQL installed.
set -euo pipefail

APP_DIR="/var/www/vonix-code-camp"
REPO="https://github.com/Vonix-Network/fcc-offline-windows.git"
DB_NAME="vonix_code_camp"
DB_USER="vonix"
NODE_VER="14"

echo "==> Vonix Code Camp deployment starting..."

# ── 1. Install system dependencies ───────────────────────────────────────────
apt-get update -qq
apt-get install -y -qq git curl build-essential python3

# Install Node.js if not present
if ! command -v node &>/dev/null; then
  echo "==> Installing Node.js $NODE_VER..."
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VER}.x | bash -
  apt-get install -y nodejs
fi

# Install PM2 globally if not present
if ! command -v pm2 &>/dev/null; then
  echo "==> Installing PM2..."
  npm install -g pm2
fi

# ── 2. Create PostgreSQL database & user ──────────────────────────────────────
echo "==> Setting up PostgreSQL..."
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
  echo "  Creating DB user '${DB_USER}'..."
  read -rsp "  Enter password for PostgreSQL user '${DB_USER}': " PGPASS
  echo
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${PGPASS}';"
fi
if ! sudo -u postgres psql -lqt | cut -d\| -f1 | grep -qw "${DB_NAME}"; then
  echo "  Creating database '${DB_NAME}'..."
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
fi

# ── 3. Clone or pull latest code ──────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "==> Pulling latest code..."
  git -C "$APP_DIR" pull origin main
else
  echo "==> Cloning repository..."
  git clone "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"

# ── 4. Create .env if it doesn't exist ────────────────────────────────────────
if [ ! -f ".env" ]; then
  echo "==> Creating .env from example..."
  cp .env.example .env
  echo ""
  echo "  !! IMPORTANT: Edit /var/www/vonix-code-camp/.env and set all values."
  echo "  !! Run this script again after editing .env."
  exit 1
fi

# ── 5. Install npm dependencies ───────────────────────────────────────────────
echo "==> Installing npm dependencies..."
npm install --production

# ── 6. Build client assets ────────────────────────────────────────────────────
echo "==> Building client assets..."
NODE_ENV=production npm run build 2>/dev/null || \
  npx gulp build -p 2>/dev/null || \
  echo "  Build step skipped (run manually if needed)"

# ── 7. Seed / migrate database ────────────────────────────────────────────────
echo "==> Seeding database with curriculum challenges..."
NODE_ENV=production node seed 2>/dev/null || \
  echo "  Seed skipped (run 'NODE_ENV=production node seed' manually)"

# ── 8. Start / reload app with PM2 ───────────────────────────────────────────
echo "==> Starting application with PM2..."
if pm2 describe vonix-code-camp &>/dev/null; then
  pm2 reload vonix-code-camp
else
  pm2 start ecosystem.config.js --env production
fi

# Save PM2 process list so it survives reboots
pm2 save
pm2 startup systemd -u root --hp /root || true

echo ""
echo "✓ Vonix Code Camp deployed!"
echo "  App running on port 3001"
echo "  View logs: pm2 logs vonix-code-camp"
echo "  Check status: pm2 status"
