# SSL/HTTPS Setup Guide

## Prerequisites

- Domain configured with DNS pointing to your server
- Certbot installed on the server

## Installation Steps

### 1. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Stop Nginx temporarily

```bash
docker compose stop nginx
```

### 3. Obtain SSL Certificates

```bash
# For production domain
sudo certbot certonly --standalone -d tamkeengaza.org -d www.tamkeengaza.org

# For test domain
sudo certbot certonly --standalone -d test.tamkeengaza.org
```

### 4. Create SSL directory and copy certificates

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates (adjust paths as needed)
sudo cp /etc/letsencrypt/live/tamkeengaza.org/fullchain.pem nginx/ssl/tamkeengaza.org.crt
sudo cp /etc/letsencrypt/live/tamkeengaza.org/privkey.pem nginx/ssl/tamkeengaza.org.key
sudo cp /etc/letsencrypt/live/test.tamkeengaza.org/fullchain.pem nginx/ssl/test.tamkeengaza.org.crt
sudo cp /etc/letsencrypt/live/test.tamkeengaza.org/privkey.pem nginx/ssl/test.tamkeengaza.org.key

# Set proper permissions
sudo chown -R $USER:$USER nginx/ssl
chmod 600 nginx/ssl/*.key
```

### 5. Update nginx.conf

Add SSL configuration to each server block:

```nginx
server {
    listen 443 ssl http2;
    server_name tamkeengaza.org www.tamkeengaza.org;

    ssl_certificate /etc/nginx/ssl/tamkeengaza.org.crt;
    ssl_certificate_key /etc/nginx/ssl/tamkeengaza.org.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name tamkeengaza.org www.tamkeengaza.org;
    return 301 https://$server_name$request_uri;
}
```

### 6. Start Nginx

```bash
docker compose up -d nginx
```

### 7. Auto-renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

## Notes

- Certificates expire every 90 days
- Certbot auto-renewal runs twice daily
- After renewal, restart nginx: `docker compose restart nginx`
