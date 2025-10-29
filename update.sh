#!/bin/bash

# Auto-update script for Arc Raiders Calculator
# Run this script on your VPS to pull latest changes and rebuild

set -e  # Exit on any error

echo "======================================"
echo "Arc Raiders Calculator - Auto Update"
echo "======================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $SCRIPT_DIR"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    git status --short
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Update cancelled"
        exit 1
    fi
fi

# Pull latest changes
echo "🔄 Pulling latest changes from GitHub..."
git pull origin "$CURRENT_BRANCH"
echo ""

# Check if package.json changed
if git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
    echo "📦 package.json changed, running npm install..."
    npm install
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build
echo ""

# Success
echo "✅ Update complete!"
echo ""
echo "Files are ready in: $SCRIPT_DIR/dist/"
echo ""

# Optional: reload nginx if it's running
if command -v nginx &> /dev/null; then
    echo "🔄 Reloading nginx..."
    sudo nginx -t && sudo systemctl reload nginx
    echo ""
fi

echo "======================================"
echo "✨ All done!"
echo "======================================"
