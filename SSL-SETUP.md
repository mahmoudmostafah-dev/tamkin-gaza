# SSL/HTTPS Setup Guide

## Quick Setup (Automated)

### 1. Run the setup script

```bash
sudo ./setup-ssl.sh
```

This script will:

- ✅ Install Certbot
- ✅ Obtain SSL certificates for all domains
- ✅ Configure Nginx with HTTPS
- ✅ Setup auto-renewal
- ✅ Test the configuration

**That's it!** Your site will be available at:

- 🌐 https://tamkeengaza.org
- 🌐 https://test.tamkeengaza.org

---

## Manual Setup (Step by Step)

### Prerequisites

- Domain DNS configured and pointing to your server
- Ports 80 and 443 open in firewall
- Docker Compose running

### Step 1: Install Certbot

```bash
sudo apt update
sudo apt install certbot -y
```

### Step 2: Stop Nginx temporarily

```bash
cd ~/tamkin-gaza
docker compose stop nginx
```

### Step 3: Obtain SSL Certificates

**For Production domain:**

```bash
sudo certbot certonly --standalone \
    --email admin@tamkeengaza.org \
    -d tamkeengaza.org \
    -d www.tamkeengaza.org
```

**For Test domain:**

```bash
sudo certbot certonly --standalone \
    --email admin@tamkeengaza.org \
    -d test.tamkeengaza.org
```

### Step 4: Copy Certificates

```bash
# Create SSL directory
mkdir -p ~/tamkin-gaza/nginx/ssl

# Copy production certificates
sudo cp /etc/letsencrypt/live/tamkeengaza.org/fullchain.pem \
    ~/tamkin-gaza/nginx/ssl/tamkeengaza.org.crt
sudo cp /etc/letsencrypt/live/tamkeengaza.org/privkey.pem \
    ~/tamkin-gaza/nginx/ssl/tamkeengaza.org.key

# Copy test certificates
sudo cp /etc/letsencrypt/live/test.tamkeengaza.org/fullchain.pem \
    ~/tamkin-gaza/nginx/ssl/test.tamkeengaza.org.crt
sudo cp /etc/letsencrypt/live/test.tamkeengaza.org/privkey.pem \
    ~/tamkin-gaza/nginx/ssl/test.tamkeengaza.org.key

# Set permissions
sudo chown -R $USER:$USER ~/tamkin-gaza/nginx/ssl
chmod 600 ~/tamkin-gaza/nginx/ssl/*.key
chmod 644 ~/tamkin-gaza/nginx/ssl/*.crt
```

### Step 5: Update Nginx Configuration

The `setup-ssl.sh` script already updates nginx.conf with SSL configuration.

If doing manually, update `nginx/nginx.conf` to include:

```nginx
server {
    listen 443 ssl http2;
    server_name tamkeengaza.org www.tamkeengaza.org;

    ssl_certificate /etc/nginx/ssl/tamkeengaza.org.crt;
    ssl_certificate_key /etc/nginx/ssl/tamkeengaza.org.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... rest of config
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name tamkeengaza.org www.tamkeengaza.org;
    return 301 https://$server_name$request_uri;
}
```

### Step 6: Start Nginx

```bash
cd ~/tamkin-gaza
docker compose up -d nginx
```

---

## Certificate Renewal

### Automatic Renewal (Recommended)

Certificates auto-renew via cron job (setup by `setup-ssl.sh`):

```bash
# Check cron job
cat /etc/cron.d/certbot-renew
```

### Manual Renewal

```bash
sudo ./renew-ssl.sh
```

Or manually:

```bash
sudo certbot renew
sudo ./renew-ssl.sh  # Copy certificates and restart nginx
```

### Test Renewal (Dry Run)

```bash
sudo certbot renew --dry-run
```

---

## Verification

### Check SSL Certificate

```bash
# Production
curl -I https://tamkeengaza.org

# Test
curl -I https://test.tamkeengaza.org
```

### Check Certificate Expiration

```bash
sudo certbot certificates
```

### Test SSL Configuration

Use online tools:

- https://www.ssllabs.com/ssltest/
- https://www.digicert.com/help/

---

## Troubleshooting

### Certificate Renewal Failed

```bash
# Check certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Try manual renewal
sudo certbot renew --force-renewal
```

### Nginx Won't Start

```bash
# Test nginx config
docker compose run --rm nginx nginx -t

# Check nginx logs
docker compose logs nginx

# Restore backup config
cp nginx/nginx.conf.backup nginx/nginx.conf
docker compose restart nginx
```

### Port 80/443 Already in Use

```bash
# Check what's using the ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Stop conflicting service
sudo systemctl stop apache2  # if Apache is running
```

### Certificate Not Found

```bash
# List all certificates
sudo certbot certificates

# Check certificate location
sudo ls -la /etc/letsencrypt/live/
```

---

## Security Best Practices

### 1. Strong SSL Configuration

Already configured in `setup-ssl.sh`:

- TLS 1.2 and 1.3 only
- Strong cipher suites
- HSTS enabled (optional)

### 2. Add HSTS Header (Optional)

Add to nginx config:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. Regular Updates

```bash
# Update certbot
sudo apt update && sudo apt upgrade certbot
```

---

## File Locations

### Certificates

- Let's Encrypt: `/etc/letsencrypt/live/`
- Project SSL: `~/tamkin-gaza/nginx/ssl/`

### Configuration

- Nginx config: `~/tamkin-gaza/nginx/nginx.conf`
- Backup config: `~/tamkin-gaza/nginx/nginx.conf.backup`

### Logs

- Certbot: `/var/log/letsencrypt/`
- Nginx: `docker compose logs nginx`

---

## Scripts

### setup-ssl.sh

Complete SSL setup automation

```bash
sudo ./setup-ssl.sh
```

### renew-ssl.sh

Manual certificate renewal

```bash
sudo ./renew-ssl.sh
```

---

## Important Notes

- ⏰ Certificates expire every **90 days**
- 🔄 Auto-renewal runs **twice daily**
- 📧 You'll receive email notifications before expiration
- 💾 Always backup before making changes
- 🔒 Keep private keys secure (600 permissions)

---

## Support

For issues:

1. Check logs: `docker compose logs nginx`
2. Test config: `docker compose run --rm nginx nginx -t`
3. Check certificates: `sudo certbot certificates`
4. Review troubleshooting section above
