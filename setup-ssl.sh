#!/bin/bash

set -e
set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔒 SSL/HTTPS Setup with Certbot${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Variables
DOMAINS_PROD="tamkeengaza.org www.tamkeengaza.org"
DOMAINS_TEST="test.tamkeengaza.org"
EMAIL="Khaledjendeya2020@gmail.com"  # Change this!
PROJECT_DIR="/home/ubuntu/tamkin-gaza"
SSL_DIR="$PROJECT_DIR/nginx/ssl"

echo -e "${YELLOW}📧 Email for SSL certificates: $EMAIL${NC}"
read -p "Is this email correct? (yes/no): " confirm_email
if [ "$confirm_email" != "yes" ]; then
    read -p "Enter your email: " EMAIL
fi

# 1. Install Certbot
echo -e "${YELLOW}📦 Installing Certbot...${NC}"
apt update
apt install -y certbot

# 2. Stop Nginx temporarily
echo -e "${YELLOW}🛑 Stopping Nginx...${NC}"
cd "$PROJECT_DIR"
docker compose stop nginx

# 3. Obtain SSL certificates for Production
echo -e "${YELLOW}🔐 Obtaining SSL certificate for PRODUCTION domains...${NC}"
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d tamkeengaza.org \
    -d www.tamkeengaza.org

# 4. Obtain SSL certificates for Test
echo -e "${YELLOW}🔐 Obtaining SSL certificate for TEST domain...${NC}"
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d test.tamkeengaza.org

# 5. Create SSL directory
echo -e "${YELLOW}📁 Creating SSL directory...${NC}"
mkdir -p "$SSL_DIR"

# 6. Copy certificates
echo -e "${YELLOW}📋 Copying certificates...${NC}"

# Production certificates
cp /etc/letsencrypt/live/tamkeengaza.org/fullchain.pem "$SSL_DIR/tamkeengaza.org.crt"
cp /etc/letsencrypt/live/tamkeengaza.org/privkey.pem "$SSL_DIR/tamkeengaza.org.key"

# Test certificates
cp /etc/letsencrypt/live/test.tamkeengaza.org/fullchain.pem "$SSL_DIR/test.tamkeengaza.org.crt"
cp /etc/letsencrypt/live/test.tamkeengaza.org/privkey.pem "$SSL_DIR/test.tamkeengaza.org.key"

# 7. Set proper permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chown -R ubuntu:ubuntu "$SSL_DIR"
chmod 600 "$SSL_DIR"/*.key
chmod 644 "$SSL_DIR"/*.crt

# 8. Backup old nginx config
echo -e "${YELLOW}💾 Backing up nginx config...${NC}"
cp "$PROJECT_DIR/nginx/nginx.conf" "$PROJECT_DIR/nginx/nginx.conf.backup"

# 9. Update nginx config with SSL
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
    listen 443 ssl http2;
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
    listen 443 ssl http2;
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

# 10. Test nginx config
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
docker compose run --rm nginx nginx -t || {
    echo -e "${RED}❌ Nginx config test failed! Restoring backup...${NC}"
    cp "$PROJECT_DIR/nginx/nginx.conf.backup" "$PROJECT_DIR/nginx/nginx.conf"
    exit 1
}

# 11. Start nginx
echo -e "${YELLOW}🚀 Starting Nginx with SSL...${NC}"
docker compose up -d nginx

# 12. Setup auto-renewal
echo -e "${YELLOW}⏰ Setting up auto-renewal...${NC}"
cat > /etc/cron.d/certbot-renew << 'CRON'
# Renew certificates twice daily and reload nginx
0 0,12 * * * root certbot renew --quiet --deploy-hook "cd /home/ubuntu/tamkin-gaza && docker compose restart nginx"
CRON

# 13. Test renewal
echo -e "${YELLOW}🧪 Testing certificate renewal (dry-run)...${NC}"
certbot renew --dry-run

# 14. Show certificate info
echo -e "${YELLOW}📜 Certificate information:${NC}"
certbot certificates

echo -e "${GREEN}✅ SSL/HTTPS setup completed successfully!${NC}"
echo -e "${GREEN}🌐 Production: https://tamkeengaza.org${NC}"
echo -e "${GREEN}🌐 Test: https://test.tamkeengaza.org${NC}"
echo -e "${BLUE}📝 Certificates will auto-renew every 90 days${NC}"
echo -e "${BLUE}💾 Nginx config backup saved to: nginx/nginx.conf.backup${NC}"
