#!/bin/bash

set -e

BASE_BRANCH="dev"
NEW_BRANCH="local-save"
# Get commit message
if [ -z "$1" ]; then
  echo "✏️ Enter commit message:"
  read COMMIT_MSG
else
  COMMIT_MSG="$1"
fi

echo "🌱 Creating local branch: $NEW_BRANCH"
git checkout "$NEW_BRANCH"

echo "📦 Adding changes..."
git add -A

echo "💾 Committing..."
if git diff --cached --quiet; then
  echo "⚠️ No changes to commit"
  exit 0
fi

git commit -m "$COMMIT_MSG"

echo "🔗 Creating Pull Request to $BASE_BRANCH..."
gh pr create --base "$BASE_BRANCH" --head "$NEW_BRANCH" --title "$COMMIT_MSG"

echo "✅ DONE - PR created successfully"