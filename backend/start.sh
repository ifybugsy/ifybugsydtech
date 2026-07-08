#!/bin/bash

# Startup script for IFYBUGSY Backend on Render

echo "[STARTUP] Starting IFYBUGSY Backend..."
echo "[STARTUP] Node version: $(node --version)"
echo "[STARTUP] npm version: $(npm --version)"

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "[STARTUP] pnpm not found, installing..."
    npm install -g pnpm
fi

echo "[STARTUP] pnpm version: $(pnpm --version)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[STARTUP] node_modules not found, installing dependencies..."
    pnpm install
else
    echo "[STARTUP] node_modules found, skipping install"
fi

# Verify critical dependencies are installed
echo "[STARTUP] Verifying dependencies..."
if ! node -e "require('express')" 2>/dev/null; then
    echo "[STARTUP] WARNING: express not found, reinstalling..."
    pnpm install
fi

echo "[STARTUP] Starting server..."
node src/index.js
