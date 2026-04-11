#!/bin/bash

set -e

# CONFIG
BASE_BRANCH="dev"
NEW_BRANCH="ci-update-$(date +%Y%m%d-%H%M%S)"

# 🎯 GET COMMIT MESSAGE
if [ -z "$1" ]; then
  echo "✏️ Enter commit message:"
  read COMMIT_MSG
else
  COMMIT_MSG="$1"
fi

echo "📝 Commit message: $COMMIT_MSG"

echo "🚀 Switching to base branch: $BASE_BRANCH"
git checkout $BASE_BRANCH

echo "⬇️ Pulling latest changes..."
git pull origin $BASE_BRANCH

echo "🌱 Creating new branch: $NEW_BRANCH"
git checkout -b $NEW_BRANCH

echo "📦 Adding changes..."
git add .

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG" || echo "No changes to commit"

echo "⬆️ Pushing branch..."
git push origin $NEW_BRANCH

echo "🔁 Creating Pull Request into $BASE_BRANCH..."

gh pr create \
  --base $BASE_BRANCH \
  --head $NEW_BRANCH \
  --title "$COMMIT_MSG" \
  --body "Automated CI update from script"

echo "✅ Done!"