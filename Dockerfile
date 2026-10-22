# Multi-stage Dockerfile for BaustoffBoard (TH Augsburg) on Google Cloud Run
# Stage 1: Build static assets and bundled server
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Initialize analytics store and set permissions
RUN echo '{"visits": 0}' > /app/analytics.json && chown -R node:node /app

USER node

EXPOSE 8080

CMD ["node", "dist/server.cjs"]
