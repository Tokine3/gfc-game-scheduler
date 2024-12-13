FROM node:18-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

COPY . .
RUN ls -la apps/api/src
RUN pnpm build --filter api

EXPOSE 4000
CMD ["pnpm", "dev", "--filter", "api"] 