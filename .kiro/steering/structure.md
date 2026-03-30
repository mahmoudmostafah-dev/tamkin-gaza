# Project Structure

## Monorepo Layout

```
tamkin/
├── .kiro/                    # Kiro AI assistant configuration
│   └── steering/             # AI guidance documents
├── nginx/                    # Nginx reverse proxy configuration
│   ├── nginx.prod.conf       # Production nginx config
│   └── nginx.test.conf       # Test nginx config
├── tamkin-backend/           # NestJS backend service
├── tamkin-frontend/          # Next.js frontend service
├── .env.prod                 # Production environment variables
├── .env.test                 # Test environment variables
├── docker-compose.prod.yml   # Production Docker Compose config
└── docker-compose.test.yml   # Test Docker Compose config
```

## Backend Structure (tamkin-backend/)

```
tamkin-backend/
├── src/                      # Source code
│   ├── app.controller.ts     # Main controller
│   ├── app.controller.spec.ts # Controller tests
│   ├── app.module.ts         # Root module
│   ├── app.service.ts        # Main service
│   └── main.ts               # Application entry point
├── test/                     # E2E tests
│   ├── app.e2e-spec.ts       # E2E test suite
│   └── jest-e2e.json         # E2E Jest config
├── dist/                     # Compiled output (generated)
├── node_modules/             # Dependencies (generated)
├── .env                      # Local environment variables
├── Dockerfile                # Container definition
├── nest-cli.json             # NestJS CLI configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.build.json       # Build-specific TS config
├── .prettierrc               # Prettier configuration
└── package.json              # Dependencies and scripts
```

### Backend Conventions

- Controllers handle HTTP requests and routing
- Services contain business logic
- Modules organize related functionality
- Use decorators for dependency injection (@Injectable, @Controller, etc.)
- Test files use `.spec.ts` suffix for unit tests
- E2E tests live in separate `test/` directory

## Frontend Structure (tamkin-frontend/)

```
tamkin-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles
│   └── favicon.ico           # Site icon
├── public/                   # Static assets
│   └── *.svg                 # SVG images
├── .next/                    # Build output (generated)
├── node_modules/             # Dependencies (generated)
├── Dockerfile                # Container definition
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── postcss.config.mjs        # PostCSS configuration
└── package.json              # Dependencies and scripts
```

### Frontend Conventions

- Use App Router (app/ directory) for routing
- Components use `.tsx` extension
- Global styles in `app/globals.css`
- Static assets in `public/` directory
- Path alias `@/*` maps to root directory

## Environment Configuration

- Environment files (`.env.prod`, `.env.test`) are at repository root
- Docker Compose passes environment variables to containers
- Each service has its own `.env` file for local development
- Separate ports for production and test environments to avoid conflicts

## Docker Architecture

- Multi-service setup with Docker Compose
- Services: Nginx (reverse proxy), PostgreSQL, Backend, Frontend
- Nginx routes traffic: `/` to frontend, `/api` to backend
- Health checks ensure proper startup order
- Separate networks for production and test environments
- Persistent volumes for PostgreSQL data
- Frontend and backend not directly exposed, only accessible through Nginx
