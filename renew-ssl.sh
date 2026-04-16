#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Renewing SSL Certificates (Docker)...${NC}"

PROJECT_DIR="$HOME/tamkin-gaza"
SSL_DIR="$PROJECT_DIR/nginx/ssl"
CERTBOT_DIR="$PROJECT_DIR/certbot"

cd "$PROJECT_DIR" || exit 1

# 1. Renew certificates using Docker
echo -e "${YELLOW}🔐 Renewing certificates...${NC}"
docker run --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    -v "$CERTBOT_DIR/www:/var/www/certbot" \
    certbot/certbot renew

# 2. Copy renewed certificates
echo -e "${YELLOW}📋 Copying renewed certificates...${NC}"

# Production
if [ -f "$CERTBOT_DIR/conf/live/tamkeengaza.org/fullchain.pem" ]; then
    cp "$CERTBOT_DIR/conf/live/tamkeengaza.org/fullchain.pem" "$SSL_DIR/tamkeengaza.org.crt"
    cp "$CERTBOT_DIR/conf/live/tamkeengaza.org/privkey.pem" "$SSL_DIR/tamkeengaza.org.key"
    echo -e "${GREEN}✅ Production certificates updated${NC}"
fi

# Test
if [ -f "$CERTBOT_DIR/conf/live/test.tamkeengaza.org/fullchain.pem" ]; then
    cp "$CERTBOT_DIR/conf/live/test.tamkeengaza.org/fullchain.pem" "$SSL_DIR/test.tamkeengaza.org.crt"
    cp "$CERTBOT_DIR/conf/live/test.tamkeengaza.org/privkey.pem" "$SSL_DIR/test.tamkeengaza.org.key"
    echo -e "${GREEN}✅ Test certificates updated${NC}"
fi

# 3. Set permissions
chmod 600 "$SSL_DIR"/*.key
chmod 644 "$SSL_DIR"/*.crt

# 4. Restart nginx
echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
docker compose restart nginx

# 5. Show certificate info
echo -e "${YELLOW}📜 Certificate expiration dates:${NC}"
docker run --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    certbot/certbot certificates

echo -e "${GREEN}✅ SSL certificates renewed successfully!${NC}"
