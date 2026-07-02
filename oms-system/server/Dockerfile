# Stage 1: Install dependencies
# Using a named stage "deps" so the next stage can copy from it
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy only package files first — Docker caches this layer
# If package.json hasn't changed, bun install won't re-run on rebuild
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 2: Production image
# Starts fresh from the base image — no build tools, smaller final image
FROM oven/bun:1 AS release
WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src ./src
COPY logger.ts ./

ENV NODE_ENV=production

# Run as non-root user for security — bun user is built into the image
USER bun

EXPOSE 8000

CMD ["bun", "src/index.ts"]
