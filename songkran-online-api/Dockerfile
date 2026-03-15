# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY src/shared/prisma ./src/shared/prisma/

# Install all dependencies (including devDeps for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema src/shared/prisma/schema.prisma

# Build TypeScript
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine

WORKDIR /app

# Copy built assets and production runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/shared/prisma ./src/shared/prisma

# Expose port
EXPOSE 4000

# Start command (runs from dist/)
CMD ["npm", "start"]
