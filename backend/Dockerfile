# Backend Dockerfile
FROM cgr.dev/chainguard/node:latest-dev AS builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY backend/ ./

# Compile TypeScript
RUN npm run build || tsc

# Production stage
FROM node:current-alpine

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy compiled code from builder
COPY --from=builder /app/backend/dist ./dist

# Copy default root-account configuration for db:admin script
COPY .default_accounts.json /app/.default_accounts.json

# Expose backend port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "node ./dist/src/main.js"]
