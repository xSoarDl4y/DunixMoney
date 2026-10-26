FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

# Copy Prisma schema before installing dependencies
COPY apps/api/prisma ./apps/api/prisma

RUN pnpm install --frozen-lockfile

# Build API
FROM deps AS build
COPY . .

RUN pnpm --filter @moneyflow/api exec prisma generate
RUN pnpm --filter @moneyflow/api build

# Production runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app /app

EXPOSE 4000

CMD ["pnpm", "--filter", "@moneyflow/api", "start"]