#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Renewing SSL Certificates...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

PROJECT_DIR="/home/ubuntu/tamkin-gaza"
SSL_DIR="$PROJECT_DIR/nginx/ssl"

# 1. Renew certificates
echo -e "${YELLOW}🔐 Renewing certificates...${NC}"
certbot renew

# 2. Copy renewed certificates
echo -e "${YELLOW}📋 Copying renewed certificates...${NC}"

# Production
if [ -f /etc/letsencrypt/live/tamkeengaza.org/fullchain.pem ]; then
    cp /etc/letsencrypt/live/tamkeengaza.org/fullchain.pem "$SSL_DIR/tamkeengaza.org.crt"
    cp /etc/letsencrypt/live/tamkeengaza.org/privkey.pem "$SSL_DIR/tamkeengaza.org.key"
    echo -e "${GREEN}✅ Production certificates updated${NC}"
fi

# Test
if [ -f /etc/letsencrypt/live/test.tamkeengaza.org/fullchain.pem ]; then
    cp /etc/letsencrypt/live/test.tamkeengaza.org/fullchain.pem "$SSL_DIR/test.tamkeengaza.org.crt"
    cp /etc/letsencrypt/live/test.tamkeengaza.org/privkey.pem "$SSL_DIR/test.tamkeengaza.org.key"
    echo -e "${GREEN}✅ Test certificates updated${NC}"
fi

# 3. Set permissions
chown -R ubuntu:ubuntu "$SSL_DIR"
chmod 600 "$SSL_DIR"/*.key
chmod 644 "$SSL_DIR"/*.crt

# 4. Restart nginx
echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
cd "$PROJECT_DIR"
docker compose restart nginx

# 5. Show certificate info
echo -e "${YELLOW}📜 Certificate expiration dates:${NC}"
certbot certificates

echo -e "${GREEN}✅ SSL certificates renewed successfully!${NC}"
