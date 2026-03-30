# Tamkin Application

## ملفات الإعداد

- `.env.prod` - إعدادات بيئة الإنتاج
- `.env.test` - إعدادات بيئة الاختبار

ملحوظة: ملفات `.env` موجودة في الـ root فقط، Docker Compose بيمرر المتغيرات للـ containers مباشرة.

## تشغيل البيئات المختلفة

### Production Environment

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

### Test Environment

```bash
docker-compose --env-file .env.test -f docker-compose.test.yml up -d
```

### إيقاف الخدمات

```bash
# Production
docker-compose -f docker-compose.prod.yml down

# Test
docker-compose -f docker-compose.test.yml down
```

## المنافذ (Ports)

### Production

- Nginx (Main Entry): http://localhost:8080
- PostgreSQL: localhost:5433

### Test

- Nginx (Main Entry): http://localhost:8000
- PostgreSQL: localhost:5432

ملحوظة: Nginx بيعمل reverse proxy للـ frontend والـ backend. استخدم `/api` للوصول للـ backend API.
