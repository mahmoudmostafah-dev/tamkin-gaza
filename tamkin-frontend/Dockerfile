# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# تحسين caching
COPY package*.json ./

RUN npm cache clean --force
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build


# Production stage
FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3200

CMD ["npm", "start"]
