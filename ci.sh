#!/bin/bash

set -e

BASE_BRANCH="dev"
NEW_BRANCH="local-update-$(date +%Y%m%d-%H%M%S)"

# GET MESSAGE
if [ -z "$1" ]; then
  echo "✏️ Enter commit message:"
  read COMMIT_MSG
else
  COMMIT_MSG="$1"
fi

echo "🚀 Switching to base branch: $BASE_BRANCH"
git checkout $BASE_BRANCH

echo "⬇️ Pulling latest changes..."
git pull origin $BASE_BRANCH

echo "🌱 Creating new branch: $NEW_BRANCH"
git checkout -b $NEW_BRANCH

echo "📦 Adding changes..."
git add .

echo "💾 Committing locally..."
git commit -m "$COMMIT_MSG" || echo "No changes to commit"

echo "✅ DONE (NO PUSH)"
echo "👉 Your changes are saved locally in branch: $NEW_BRANCH"