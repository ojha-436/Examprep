# Production Dockerfile for ExamPrep AI on Google Cloud Run
FROM node:20-slim

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (including build tools)
RUN npm install --legacy-peer-deps

# Copy source code and configuration
COPY . .

# Build Vite client production assets into dist/
RUN npm run build

# Cloud Run injects PORT environment variable (default: 8080)
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Start Express server via tsx
CMD ["node", "./node_modules/tsx/dist/cli.mjs", "server.ts"]
