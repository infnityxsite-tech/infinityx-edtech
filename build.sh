#!/bin/bash
# Render.com Build Script

echo "🔨 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build frontend
echo "🎨 Building frontend..."
pnpm build

# Build server
echo "⚙️ Building server..."
pnpm build:server

echo "✅ Build completed successfully!"
