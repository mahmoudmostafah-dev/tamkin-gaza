#!/bin/bash

set -e
set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}⏮️  PRODUCTION ROLLBACK${NC}"
echo -e "${YELLOW}⚠️  This will rollback PRODUCTION to previous commit!${NC}"

cd ~/tamkin-gaza || exit 1

# Show recent commits
echo -e "${YELLOW}📜 Recent commits:${NC}"
git log --oneline -5

# Get current commit
CURRENT_COMMIT=$(git rev-parse HEAD)
echo -e "${YELLOW}Current commit: $CURRENT_COMMIT${NC}"

# Ask for commit to rollback to
read -p "Enter commit hash to rollback to (or press Enter for previous commit): " target_commit

if [ -z "$target_commit" ]; then
    target_commit="HEAD~1"
fi

# Confirmation
echo -e "${RED}⚠️  About to rollback to: $target_commit${NC}"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}❌ Rollback cancelled${NC}"
    exit 0
fi

# Rollback
echo -e "${YELLOW}⏮️  Rolling back...${NC}"
git checkout $target_commit

# Rebuild and restart
echo -e "${YELLOW}🔨 Rebuilding containers...${NC}"
docker compose build --no-cache backend-prod frontend-prod

echo -e "${YELLOW}🚀 Restarting containers...${NC}"
docker compose up -d --force-recreate backend-prod frontend-prod

echo -e "${YELLOW}🔄 Restarting nginx...${NC}"
docker compose restart nginx

echo -e "${GREEN}✅ Rollback completed!${NC}"
echo -e "${YELLOW}📝 Recent logs:${NC}"
docker compose logs --tail=20 backend-prod frontend-prod
