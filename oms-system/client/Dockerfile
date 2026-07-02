# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
# The build stage produced a dist/ folder with static files
# Nginx serves them — no Node.js needed at runtime
FROM nginx:alpine AS release

# Copy built files to Nginx's default static folder
COPY --from=build /app/dist /usr/share/nginx/html

# Override default Nginx config with ours (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
