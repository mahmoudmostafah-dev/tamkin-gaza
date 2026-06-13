#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Deploying TEST environment...${NC}"

# Change to project directory
cd ~/tamkin-gaza || {
    echo -e "${RED}❌ Failed to change to project directory${NC}"
    exit 1
}

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

# 1) Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from main branch...${NC}"
git checkout main
git pull origin main

# 2) Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Warning: Uncommitted changes detected${NC}"
    git status -s
fi

# 3) Build and deploy backend-test
echo -e "${YELLOW}🔨 Building backend-test...${NC}"
docker compose build --no-cache backend-test

echo -e "${YELLOW}🚀 Deploying backend-test...${NC}"
docker compose up -d --no-deps --force-recreate backend-test

# Wait for backend to be healthy
echo -e "${YELLOW}⏳ Waiting for backend-test to be ready...${NC}"
sleep 5

# 4) Build and deploy frontend-test
echo -e "${YELLOW}🔨 Building frontend-test...${NC}"
docker compose build --no-cache frontend-test

echo -e "${YELLOW}🚀 Deploying frontend-test...${NC}"
docker compose up -d --no-deps --force-recreate frontend-test

# 5) Restart nginx to ensure routing is updated
echo -e "${YELLOW}🔄 Restarting nginx...${NC}"
docker compose restart nginx

# 6) Cleanup
echo -e "${YELLOW}🧹 Cleaning up unused images...${NC}"
docker image prune -f

# 7) Show status
echo -e "${YELLOW}📊 Container status:${NC}"
docker compose ps | grep -E "(backend-test|frontend-test|postgres-test|nginx)"

# 8) Show logs
echo -e "${YELLOW}📝 Recent logs:${NC}"
docker compose logs --tail=20 backend-test frontend-test

echo -e "${GREEN}✅ TEST deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Test site: http://test.tamkeengaza.org${NC}"
