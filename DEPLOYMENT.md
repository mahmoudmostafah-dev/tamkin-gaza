# Deployment Guide

## Overview

This project uses separate deployment scripts for Test and Production environments.

## Prerequisites

- Docker and Docker Compose installed
- `.env` file configured on the server
- SSH access to the server
- Git repository access

## Deployment Scripts

### 1. Test Environment Deployment

```bash
./deploy-test.sh
```

**What it does:**

- Pulls latest code from `main` branch
- Builds backend-test and frontend-test with `--no-cache`
- Recreates containers without affecting production
- Restarts nginx
- Shows container status and logs
- Cleans up unused images

**URL:** http://test.tamkeengaza.org

**When to use:**

- Testing new features
- QA validation
- Before production deployment

---

### 2. Production Environment Deployment

```bash
./deploy-prod.sh
```

**What it does:**

- **Asks for confirmation** (safety measure)
- Checks for uncommitted changes (fails if found)
- Creates database backup automatically
- Pulls latest code from `main` branch
- Builds backend-prod and frontend-prod with `--no-cache`
- Recreates containers
- Restarts nginx
- Runs health checks
- Shows container status and logs
- Cleans up unused images

**URL:** http://tamkeengaza.org

**When to use:**

- After successful test deployment
- For production releases only

---

### 3. Production Rollback

```bash
./rollback-prod.sh
```

**What it does:**

- Shows recent commits
- Asks which commit to rollback to (default: previous commit)
- **Asks for confirmation**
- Checks out the specified commit
- Rebuilds and restarts production containers
- Shows logs

**When to use:**

- Emergency rollback after failed deployment
- Critical bugs in production

---

## Deployment Workflow

### Standard Deployment Flow:

```
1. Develop → Commit → Push to main
2. Deploy to Test: ./deploy-test.sh
3. Test and validate on test.tamkeengaza.org
4. Deploy to Production: ./deploy-prod.sh
5. Verify on tamkeengaza.org
```

### Emergency Rollback Flow:

```
1. Issue detected in production
2. Run: ./rollback-prod.sh
3. Select previous stable commit
4. Verify rollback successful
5. Fix issue and redeploy
```

---

## Important Notes

### ⚠️ Before Production Deployment:

1. ✅ Test thoroughly on test environment
2. ✅ Ensure all tests pass
3. ✅ Review recent commits
4. ✅ Notify team members
5. ✅ Have rollback plan ready

### 🔒 Security:

- Never commit `.env` file
- Database backups are created automatically before prod deployment
- Backups are saved as `backup-prod-YYYYMMDD-HHMMSS.sql`

### 📊 Monitoring:

After deployment, check:

- Container status: `docker compose ps`
- Logs: `docker compose logs -f backend-prod frontend-prod`
- Health endpoint: `curl http://localhost/health`
- Website accessibility

### 🐛 Troubleshooting:

**Deployment fails:**

```bash
# Check logs
docker compose logs backend-prod frontend-prod

# Check container status
docker compose ps

# Restart specific service
docker compose restart backend-prod
```

**Database connection issues:**

```bash
# Check postgres is running
docker compose ps postgres-prod

# Check database logs
docker compose logs postgres-prod

# Test connection
docker compose exec backend-prod env | grep DATABASE
```

**Nginx routing issues:**

```bash
# Check nginx config
docker compose exec nginx nginx -t

# Restart nginx
docker compose restart nginx

# Check nginx logs
docker compose logs nginx
```

---

## File Permissions

Make scripts executable:

```bash
chmod +x deploy-test.sh deploy-prod.sh rollback-prod.sh
```

---

## Environment Variables

Ensure `.env` file contains:

```bash
# Database
POSTGRES_TEST_USER=tamkin
POSTGRES_TEST_PASSWORD=***
POSTGRES_TEST_DB=tamkin_test

POSTGRES_PROD_USER=tamkin
POSTGRES_PROD_PASSWORD=***
POSTGRES_PROD_DB=tamkin_prod

# Application
TEST_ENV=test
PROD_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=3200
```

---

## Backup Management

### Manual Database Backup:

```bash
# Test database
docker compose exec postgres-test pg_dump -U tamkin tamkin_test > backup-test.sql

# Production database
docker compose exec postgres-prod pg_dump -U tamkin tamkin_prod > backup-prod.sql
```

### Restore Database:

```bash
# Test database
docker compose exec -T postgres-test psql -U tamkin tamkin_test < backup-test.sql

# Production database
docker compose exec -T postgres-prod psql -U tamkin tamkin_prod < backup-prod.sql
```

---

## Support

For issues or questions, contact the development team.
