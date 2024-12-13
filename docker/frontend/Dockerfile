FROM node:18-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build --filter frontend

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

EXPOSE 3000
CMD ["pnpm", "dev", "--filter", "frontend"] 