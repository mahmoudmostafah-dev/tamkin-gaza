#!/bin/bash

set -e
set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔒 SSL/HTTPS Setup with Certbot (Docker)${NC}"

# Variables
EMAIL="Khaledjendeya2020@gmail.com"  # Change this!
PROJECT_DIR="$HOME/tamkin-gaza"
SSL_DIR="$PROJECT_DIR/nginx/ssl"
CERTBOT_DIR="$PROJECT_DIR/certbot"

echo -e "${YELLOW}📧 Email for SSL certificates: $EMAIL${NC}"
read -p "Is this email correct? (yes/no): " confirm_email
if [ "$confirm_email" != "yes" ]; then
    read -p "Enter your email: " EMAIL
fi

cd "$PROJECT_DIR" || exit 1

# 1. Create directories
echo -e "${YELLOW}� Creating directories...${NC}"
mkdir -p "$SSL_DIR"
mkdir -p "$CERTBOT_DIR/conf"
mkdir -p "$CERTBOT_DIR/www"

# 2. Stop Nginx temporarily
echo -e "${YELLOW}🛑 Stopping Nginx...${NC}"
docker compose stop nginx

# 3. Obtain SSL certificate for Production
echo -e "${YELLOW}🔐 Obtaining SSL certificate for PRODUCTION (tamkeengaza.org)...${NC}"
docker run --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    -v "$CERTBOT_DIR/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d tamkeengaza.org \
    -d www.tamkeengaza.org

# 4. Obtain SSL certificate for Test
echo -e "${YELLOW}🔐 Obtaining SSL certificate for TEST (test.tamkeengaza.org)...${NC}"
docker run --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    -v "$CERTBOT_DIR/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d test.tamkeengaza.org

# 5. Copy certificates to nginx/ssl
echo -e "${YELLOW}📋 Copying certificates...${NC}"

# Production
sudo cp "$CERTBOT_DIR/conf/live/tamkeengaza.org/fullchain.pem" "$SSL_DIR/tamkeengaza.org.crt"
sudo cp "$CERTBOT_DIR/conf/live/tamkeengaza.org/privkey.pem" "$SSL_DIR/tamkeengaza.org.key"

# Test
sudo cp "$CERTBOT_DIR/conf/live/test.tamkeengaza.org/fullchain.pem" "$SSL_DIR/test.tamkeengaza.org.crt"
sudo cp "$CERTBOT_DIR/conf/live/test.tamkeengaza.org/privkey.pem" "$SSL_DIR/test.tamkeengaza.org.key"

# 6. Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
sudo chown -R $USER:$USER "$SSL_DIR"
sudo chown -R $USER:$USER "$CERTBOT_DIR"
chmod 600 "$SSL_DIR"/*.key
chmod 644 "$SSL_DIR"/*.crt

# 7. Backup old nginx config
echo -e "${YELLOW}💾 Backing up nginx config...${NC}"
cp "$PROJECT_DIR/nginx/nginx.conf" "$PROJECT_DIR/nginx/nginx.conf.backup"

# 8. Update nginx config with SSL
echo -e "${YELLOW}⚙️  Updating nginx configuration...${NC}"
cat > "$PROJECT_DIR/nginx/nginx.conf" << 'EOF'
upstream frontend-test {
    server frontend-test:3200;
}

upstream backend-test {
    server backend-test:3000;
}

upstream frontend-prod {
    server frontend-prod:3200;
}

upstream backend-prod {
    server backend-prod:3000;
}

# ============================================
# Test Environment - HTTPS
# ============================================
server {
    listen 443 ssl;
    http2 on;
    server_name test.tamkeengaza.org;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/test.tamkeengaza.org.crt;
    ssl_certificate_key /etc/nginx/ssl/test.tamkeengaza.org.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Backend API
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://backend-test;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Frontend
    location / {
        proxy_pass http://frontend-test;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "test-healthy\n";
        add_header Content-Type text/plain;
    }
}

# Test Environment - HTTP to HTTPS redirect
server {
    listen 80;
    server_name test.tamkeengaza.org;
    return 301 https://$server_name$request_uri;
}

# ============================================
# Production Environment - HTTPS
# ============================================
server {
    listen 443 ssl;
    http2 on;
    server_name tamkeengaza.org www.tamkeengaza.org;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/tamkeengaza.org.crt;
    ssl_certificate_key /etc/nginx/ssl/tamkeengaza.org.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Backend API
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://backend-prod;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Frontend
    location / {
        proxy_pass http://frontend-prod;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "prod-healthy\n";
        add_header Content-Type text/plain;
    }
}

# Production Environment - HTTP to HTTPS redirect
server {
    listen 80;
    server_name tamkeengaza.org www.tamkeengaza.org;
    return 301 https://$server_name$request_uri;
}
EOF

# 9. Test nginx config
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
docker compose run --rm nginx nginx -t || {
    echo -e "${RED}❌ Nginx config test failed! Restoring backup...${NC}"
    cp "$PROJECT_DIR/nginx/nginx.conf.backup" "$PROJECT_DIR/nginx/nginx.conf"
    exit 1
}

# 10. Start nginx
echo -e "${YELLOW}🚀 Starting Nginx with SSL...${NC}"
docker compose up -d nginx

# 11. Setup auto-renewal cron job
echo -e "${YELLOW}⏰ Setting up auto-renewal...${NC}"
CRON_FILE="/tmp/certbot-renew-cron"
cat > "$CRON_FILE" << CRON
# Renew SSL certificates twice daily
0 0,12 * * * cd $PROJECT_DIR && ./renew-ssl.sh >> $PROJECT_DIR/certbot/renewal.log 2>&1
CRON

crontab -l 2>/dev/null | cat - "$CRON_FILE" | crontab -
rm "$CRON_FILE"

# 12. Test renewal (dry-run) - Optional, can be skipped
echo -e "${YELLOW}🧪 Testing certificate renewal (dry-run)...${NC}"
timeout 30 docker run --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    -v "$CERTBOT_DIR/www:/var/www/certbot" \
    certbot/certbot renew --dry-run 2>/dev/null || echo -e "${YELLOW}⚠️  Dry-run test skipped or timed out (not critical)${NC}"

# 13. Show certificate info
echo -e "${YELLOW}📜 Certificate information:${NC}"
docker run --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    certbot/certbot certificates

echo -e "${GREEN}✅ SSL/HTTPS setup completed successfully!${NC}"
echo -e "${GREEN}🌐 Production: https://tamkeengaza.org${NC}"
echo -e "${GREEN}🌐 Test: https://test.tamkeengaza.org${NC}"
echo -e "${BLUE}📝 Certificates will auto-renew every 90 days${NC}"
echo -e "${BLUE}💾 Nginx config backup: nginx/nginx.conf.backup${NC}"
echo -e "${BLUE}📁 Certificates stored in: $CERTBOT_DIR/conf${NC}"
