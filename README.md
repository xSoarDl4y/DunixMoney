# MONEYFLOW — Web + Mobile + API

MONEYFLOW is a TypeScript monorepo for a personal finance app:

- `apps/web`: Next.js dashboard with account registration/login and API-backed transactions.
- `apps/mobile`: Expo / React Native client with registration/login and API-backed transactions.
- `apps/api`: NestJS REST API, JWT authentication, validation, user-scoped transaction CRUD.
- `apps/api/prisma`: PostgreSQL schema and migrations.
- `packages/finance-core`: shared VND formatting and finance calculations.

## Requirements

- Node.js 22.13+ recommended for the SDK 58 mobile app
- pnpm 9+
- PostgreSQL 14+ (local or hosted)

## 1. Install dependencies

From the repository root:

```powershell
pnpm.cmd install
```

## 2. Configure PostgreSQL and API

You can use local PostgreSQL, or start a local PostgreSQL container if Docker Desktop is installed:

```powershell
docker compose up -d postgres
```

The included local container uses database/user `moneyflow` and password `change-this-local-password` (development only). Copy `apps/api/.env.example` to `apps/api/.env` and set `DATABASE_URL` to `postgresql://moneyflow:change-this-local-password@localhost:5432/moneyflow?schema=public`; replace `JWT_SECRET` with a random secret at least 32 characters long. Do not commit `.env` files. Never reuse the example password or JWT secret in production.

Example local database URL:

```text
postgresql://postgres:YOUR_PASSWORD@localhost:5432/moneyflow?schema=public
```

Generate Prisma Client and apply the initial schema:

```powershell
pnpm.cmd db:generate
pnpm.cmd db:migrate
```

The initial migration is included in `apps/api/prisma/migrations`; `db:migrate` applies it to your local database.

Start the API in one terminal:

```powershell
pnpm.cmd dev:api
```

Health checks:

- `http://localhost:4000/api/v1/health`
- `http://localhost:4000/api/v1/ready` (requires database connectivity)

## 3. Run the Web app

Copy `apps/web/.env.example` to `apps/web/.env.local` if you need to change the API URL. For local development, the default is `http://localhost:4000/api/v1`.

In a second terminal from the repository root:

```powershell
pnpm.cmd dev:web
```

Open `http://localhost:3000`, register a user, then add transactions. Transactions are stored in PostgreSQL through the API and are scoped to the signed-in user. Web login tokens are stored in browser localStorage for this development MVP; use a hardened HttpOnly-cookie/session design before handling sensitive production data.

## 4. Run the Mobile app

The mobile app uses the same API and PostgreSQL data. On a physical iPhone, `localhost` means the iPhone itself, not your Windows PC. Copy `apps/mobile/.env.example` to `apps/mobile/.env`, then set `EXPO_PUBLIC_API_URL` to your PC's LAN IPv4 address, for example:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.20:4000/api/v1
```

Find the PC IPv4 address with `ipconfig`; ensure phone and PC share Wi-Fi and Windows Firewall permits the API port. The API CORS setting is for browser clients; native apps are not governed by browser CORS.

Install dependencies and align Expo packages for the installed SDK:

```powershell
pnpm.cmd install
cd apps/mobile
pnpm.cmd exec expo install --fix
pnpm.cmd exec expo start --clear
```

Use Expo Go only if its installed version supports the project's SDK; otherwise use a compatible development build. The exact Expo package compatibility should be confirmed on the target device before release.

## API overview

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token)
- `GET /api/v1/transactions` (Bearer token)
- `POST /api/v1/transactions` (Bearer token)
- `PATCH /api/v1/transactions/:id` (Bearer token)
- `DELETE /api/v1/transactions/:id` (Bearer token)
- `GET /api/v1/health`
- `GET /api/v1/ready`

Passwords are hashed with bcryptjs. Authenticated transaction queries are scoped to the token's user ID. Request validation rejects unexpected properties. See `apps/api/test-plan.md` for a manual test plan.

## Build

```powershell
pnpm.cmd build:web
pnpm.cmd build:api
```

## Important status and production checklist

Implemented in this iteration: JWT registration/login, user profile endpoint, PostgreSQL Prisma schema, database migration scripts, validated transaction create/list/update/delete endpoints, web/mobile clients calling the same API, and a manual API test plan.

Not yet production-ready: automated integration/e2e test suite, password reset/email verification, rate limiting and brute-force controls, refresh-token/session rotation, audit logs, backup/restore policy, production secrets management, CI/CD, hosting configuration, and privacy/security review. The mobile SDK version and iOS Expo Go compatibility must be validated on the actual device. Do not use real sensitive financial data until production security and deployment checks are complete.
