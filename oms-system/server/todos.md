# Project Roadmap: Node.js/Bun & Drizzle ORM

## ✅ Completed Tasks

### Foundations
- [x] Scaffolding a Node.js app using JavaScript
- [x] Scaffolding an Express app using JavaScript
- [x] Express route chaining for modular architecture
- [x] Hot reload setup (Nodemon/Watch mode)

### Modern Stack (Bun + TypeScript)
- [x] Scaffolding a Bun runtime project
- [x] Scaffolding an Express app in Bun using TypeScript
- [x] Environment variable (`.env`) setup and validation
- [x] Pino JSON logger integration — with pino-http, pino-pretty for dev, custom log levels by HTTP status code
- [x] Drizzle ORM setup (Schema generation & Migrations)
- [x] Drizzle Studio for SQLite management
- [x] Zod schema inference from Drizzle for automated validation
- [x] Centralized Database initialization module
- [x] REST API testing using `api.http`
- [x] Data seeding script for development

---

## ⏳ Pending Tasks

### Core Features
- [x] **File Handling**: Accept multipart form-data (CSV, XLSX, Images, Video) using Multer/Busboy
- [ ] **Streaming**: Implement streaming responses for large content
- [x] **Background Jobs**: Workers and Queues using BullMQ and Redis
- [ ] **Batch Processing**: Write and schedule batch jobs/cron tasks

### Infrastructure & DevOps
- [ ] **Dockerization**: Create optimized multi-stage Dockerfiles
- [ ] **CI/CD**: Setup GitHub Actions for automated testing and deployment
- [ ] **APM & Monitoring**: Setup OpenTelemetry or Elastic APM for tracing and metrics
- [ ] **Deployment**: Host the app on Render/Railway/Fly.io

---

## 🚀 Recommended Additions (Missing)

### Security & Production Readiness
- [x] **Authentication**: Implement JWT or Session-based auth (e.g., Lucia or Passport) — built from scratch using `jose` + `bcryptjs` + HttpOnly cookies
- [ ] **Authorization**: Role-based access control (RBAC)
- [x] **Global Error Handling**: Implement a centralized error-handling middleware — AppError class + 4-arg Express error handler
- [ ] **Security Headers**: Setup `helmet` and CORS policies
- [ ] **Rate Limiting**: Protect APIs from brute force/abuse

### Quality Assurance
- [ ] **Testing**: Setup Vitest or Jest for Unit and Integration tests
- [ ] **API Documentation**: Auto-generate Swagger/OpenAPI docs from Zod schemas

### Database Advanced
- [ ] **Soft Deletes**: Implement a pattern for `deleted_at` across tables
- [ ] **Complex Relations**: Implement many-to-many relationships and complex joins

### Monorepo & Multi-Package Architecture (Turborepo)
- [ ] **Workspace Setup**: Migrate to a Turborepo/pnpm workspaces monorepo structure
- [ ] **Shared Configurations**: Create internal packages for shared ESLint, Prettier, and TypeScript configs
- [ ] **React Frontend Packages**: Scaffolding shared UI component libraries (e.g., `@repo/ui`) for React apps
- [ ] **Bun Backend Packages**: Modularize backend logic into shared packages for multiple Bun services
- [ ] **Shared Schema**: Export Drizzle schemas and Zod types as a shared package for both Frontend & Backend

### Services & Real-time
- [x] **Object Storage (S3)**: Implement file storage and retrieval using S3-compatible services (e.g., Minio for local development)
- [ ] **Email System**: Setup transactional email templates using `react-email` and a provider like `Resend`
- [ ] **Real-time Communication**: Implement Chat and Notification systems using WebSockets (native Bun or Socket.io)
