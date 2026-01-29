# Technology Stack

## Frontend

### Core Framework
- **Next.js 14** (App Router) - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible, customizable UI components (Radix UI based)

### Key Libraries
- **Framer Motion** - Animations and transitions
- **Zustand** - Lightweight state management
- **React Query (@tanstack/react-query)** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **next-i18next** - Internationalization (Chinese/English)

### Design System
- **Brand Colors**: Deep Forest Green (#0F4C3A), Tech Blue (#2A5FAD), Luxury Gold (#D4AF37)
- **Typography**: Source Han Sans (Chinese), DM Sans/Playfair Display (English)
- **Animations**: Scroll-triggered, hover effects, page transitions
- **Responsive**: Mobile-first (640px/768px/1024px/1440px breakpoints)

## Backend

### Two Deployment Modes

#### Development Mode (Recommended for Local)
- **Single Application**: `backend/manqiyou-app`
- **Framework**: Spring Boot 3.2.x + Java 17
- **Database**: H2 in-memory (auto-initialized with schema.sql + data.sql)
- **Port**: 8080
- **Purpose**: Fast local development and API testing

#### Production Mode (Microservices)
- **Gateway**: `manqiyou-gateway` (port 8080)
- **Services**: user (8081), route (8082), order (8083), member (8084), cms (8085)
- **Framework**: Spring Boot 3.2.x + Spring Cloud 2023.x
- **Database**: PostgreSQL 16
- **Cache**: Redis 7

### Backend Stack
- **ORM**: MyBatis-Plus 3.5.6
- **Security**: JWT (jjwt 0.12.5)
- **Utilities**: Hutool 5.8.27, Lombok 1.18.32
- **Testing**: JUnit 5 + jqwik (property-based testing)

## Infrastructure

### Development
- **Docker Compose**: PostgreSQL + Redis + Adminer (optional)
- **Build Tools**: Maven Wrapper (mvnw/mvnw.cmd)
- **Package Manager**: npm

### Production (Aliyun Ubuntu 24.04)
- **Web Server**: Nginx (reverse proxy, SSL termination)
- **Process Management**: PM2 (frontend), systemd (backend)
- **SSL**: Let's Encrypt (Certbot)
- **Monitoring**: Logs via journalctl, PM2 logs

## Common Commands

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint
npm run test         # Vitest unit tests
```

### Backend (Development Mode)
```bash
cd backend/manqiyou-app
./mvnw spring-boot:run              # Unix/Mac
mvnw.cmd spring-boot:run            # Windows
./mvnw clean package -DskipTests    # Build JAR
```

### Quick Start (Windows)
```bash
start-all.bat        # Start both frontend and backend
start-frontend.bat   # Frontend only
start-backend.bat    # Backend only (development mode)
```

### Docker
```bash
docker-compose up -d              # Start PostgreSQL + Redis
docker-compose down               # Stop services
docker-compose logs -f postgres   # View logs
```

## API Conventions

### Base URL
- **Environment Variable**: `NEXT_PUBLIC_API_URL`
- **Development**: `http://localhost:8080/api`
- **Production**: `https://your-domain.com/api`

### Important
The `NEXT_PUBLIC_API_URL` **includes** `/api` prefix. API client calls should use endpoints like `/routes`, `/categories` (without `/api`).

### Response Format
```typescript
{
  code: number,      // 200 = success
  message: string,
  data: T,
  timestamp: string
}
```

### Authentication
- JWT tokens stored in localStorage
- Auto-attached to requests via `Authorization: Bearer <token>`
- Development: Mock auth with universal code `123456`

## File Structure Conventions

### Frontend
- `src/app/` - Next.js pages (App Router)
- `src/components/ui/` - Base UI components (shadcn/ui)
- `src/components/layout/` - Layout components
- `src/components/home/` - Page-specific components
- `src/lib/api/` - API client and endpoints
- `src/lib/i18n/` - Internationalization
- `src/hooks/` - Custom React hooks
- `src/stores/` - Zustand state stores
- `src/types/` - TypeScript type definitions

### Backend
- `controller/` - REST API endpoints
- `service/` - Business logic
- `mapper/` - MyBatis data access
- `entity/` - Database entities
- `config/` - Spring configuration
- `common/` - Shared utilities (Result wrapper)

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=manqiyou
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## Testing

### Frontend
- **Unit Tests**: Vitest + Testing Library
- **E2E**: Playwright (configured but not extensively used)
- Run: `npm run test` or `npm run test:run`

### Backend
- **Unit Tests**: JUnit 5
- **Property-Based**: jqwik
- Run: `./mvnw test`

## Performance Targets
- First Contentful Paint < 2s
- Lighthouse Performance > 90
- Mobile-responsive design
- Optimized images and lazy loading
