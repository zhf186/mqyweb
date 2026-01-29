# Project Structure

## Repository Organization

This is a monorepo containing frontend (Next.js) and backend (Spring Boot) applications with shared assets and deployment scripts.

```
manqiyou/
├── frontend/              # Next.js 14 application
├── backend/               # Spring Boot microservices
├── brand_assets/          # Source brand materials (images, logos)
├── deploy/                # Deployment scripts and documentation
├── pics/                  # Additional image assets
├── .kiro/                 # Kiro IDE configuration
│   ├── specs/            # Project specifications
│   └── steering/         # AI assistant guidance (this file)
└── *.bat                  # Windows quick-start scripts
```

## Frontend Structure (`frontend/`)

### Next.js App Router Layout
```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   ├── routes/            # Cycling routes pages
│   │   │   ├── page.tsx       # Routes list
│   │   │   └── [id]/page.tsx  # Route detail (dynamic)
│   │   ├── about/             # About page
│   │   ├── community/         # Community page
│   │   ├── ebike/             # E-bike info page
│   │   ├── goods/             # Marketplace page
│   │   ├── partners/          # Partners page
│   │   └── [other pages]/
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── [other ui]/
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── home/              # Homepage-specific components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── [other sections]/
│   │   └── animation/         # Reusable animation components
│   │
│   ├── lib/
│   │   ├── api/               # API client and endpoints
│   │   │   ├── client.ts      # Base fetch wrapper
│   │   │   └── routes.ts      # Route-specific API calls
│   │   ├── i18n/              # Internationalization
│   │   └── utils.ts           # Utility functions (cn, etc.)
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── use-*.ts
│   │
│   ├── stores/                # Zustand state management
│   │   └── *-store.ts
│   │
│   └── types/                 # TypeScript definitions
│       └── *.ts
│
├── public/
│   ├── brand_assets/          # Copied from root (via setup-assets.bat)
│   │   ├── hero/
│   │   ├── brand/
│   │   ├── ebike/
│   │   ├── routes/
│   │   └── [other categories]/
│   └── [other static files]
│
├── .env.local                 # Local environment variables
├── .env.example               # Environment template
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── vitest.config.ts           # Vitest test configuration
```

### Frontend Conventions

#### Component Organization
- **UI Components** (`components/ui/`): Reusable, atomic components from shadcn/ui
- **Layout Components** (`components/layout/`): Header, Footer, Navigation
- **Feature Components** (`components/[feature]/`): Page-specific components grouped by feature
- **Animation Components** (`components/animation/`): Reusable animation wrappers

#### Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Hooks**: `use-` prefix (e.g., `use-scroll-animation.ts`)
- **Stores**: `-store` suffix (e.g., `auth-store.ts`)
- **Types**: PascalCase interfaces/types (e.g., `Route`, `Category`)

#### Import Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)
- Example: `import { Button } from '@/components/ui/button'`

## Backend Structure (`backend/`)

### Microservices Architecture
```
backend/
├── manqiyou-app/              # Development single application
│   ├── src/main/
│   │   ├── java/com/manqiyou/
│   │   │   ├── controller/    # REST API endpoints
│   │   │   ├── service/       # Business logic
│   │   │   ├── mapper/        # MyBatis data access
│   │   │   ├── entity/        # Database entities
│   │   │   ├── config/        # Spring configuration
│   │   │   └── common/        # Shared utilities
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── schema.sql     # H2 database schema
│   │       └── data.sql       # Sample data
│   ├── mvnw / mvnw.cmd        # Maven wrapper
│   ├── pom.xml
│   └── run.bat                # Windows run script
│
├── manqiyou-gateway/          # API Gateway (microservices)
├── manqiyou-user/             # User service (port 8081)
├── manqiyou-route/            # Route service (port 8082)
├── manqiyou-order/            # Order service (port 8083)
├── manqiyou-member/           # Member service (port 8084)
├── manqiyou-cms/              # CMS service (port 8085)
│
├── manqiyou-common/           # Shared modules
│   ├── manqiyou-common-core/
│   ├── manqiyou-common-redis/
│   └── manqiyou-common-security/
│
├── sql/                       # PostgreSQL initialization
│   ├── init.sql
│   └── sample-data.sql
│
├── .env.example               # Environment template
└── pom.xml                    # Parent POM
```

### Backend Conventions

#### Package Structure (per service)
```
com.manqiyou.[service]/
├── controller/          # @RestController classes
├── service/            # @Service business logic
│   └── impl/          # Service implementations
├── mapper/             # MyBatis @Mapper interfaces
├── entity/             # @Entity / @TableName classes
├── dto/                # Data Transfer Objects
├── config/             # @Configuration classes
└── common/             # Utilities, constants, Result wrapper
```

#### Naming Conventions
- **Controllers**: `*Controller` (e.g., `RouteController`)
- **Services**: `*Service` interface + `*ServiceImpl` implementation
- **Mappers**: `*Mapper` (e.g., `RouteMapper extends BaseMapper<Route>`)
- **Entities**: Match table names (e.g., `Route`, `Category`)
- **DTOs**: `*DTO` or `*Request`/`*Response`

#### API Endpoint Patterns
- Base path: `/api/[resource]`
- List: `GET /api/routes`
- Detail: `GET /api/routes/{id}`
- Create: `POST /api/routes`
- Update: `PUT /api/routes/{id}`
- Delete: `DELETE /api/routes/{id}`

## Brand Assets (`brand_assets/`)

Organized by content category:
```
brand_assets/
├── hero/              # Homepage hero images
├── brand/             # Brand identity materials
├── ebike/             # E-bike product photos
├── routes/            # Route photography
├── goods/             # Marketplace products
├── community/         # Community event photos
├── partner/           # Partner logos
├── cities/            # City/location images
└── sections/          # Section-specific imagery
```

**Important**: Run `setup-assets.bat` to copy these to `frontend/public/brand_assets/` before frontend development.

## Deployment Scripts (`deploy/`)

```
deploy/
├── setup-server.sh        # Initial server setup (Node, Java, PM2, etc.)
├── deploy.sh              # Main deployment script
├── ssl-setup.sh           # SSL certificate configuration
├── update.sh              # Update deployed application
├── upload-to-server.ps1   # Windows upload script
├── README.md              # Deployment documentation
├── QUICK-START.md         # Quick deployment guide
├── CHECKLIST.md           # Pre-deployment checklist
└── [Chinese docs]         # Additional Chinese documentation
```

## Configuration Files

### Root Level
- `docker-compose.yml` - PostgreSQL + Redis for microservices
- `start-all.bat` - Start both frontend and backend (Windows)
- `start-frontend.bat` - Start frontend only
- `start-backend.bat` - Start backend only
- `setup-assets.bat` - Copy brand assets to frontend

### Documentation
- `README.md` - Main project documentation
- `DEVELOPMENT.md` - Development guide
- `DEPLOYMENT.md` - Deployment guide
- `漫骑游官方网站开发全案说明书.md` - Comprehensive project specification (Chinese)

## Development Workflow

### Starting Development
1. **Assets**: Run `setup-assets.bat` (first time only)
2. **Backend**: Run `start-backend.bat` or `cd backend/manqiyou-app && mvnw.cmd spring-boot:run`
3. **Frontend**: Run `start-frontend.bat` or `cd frontend && npm run dev`
4. **Access**: Frontend at http://localhost:3000, Backend at http://localhost:8080

### Adding New Features

#### Frontend Page
1. Create route in `src/app/[page]/page.tsx`
2. Add components in `src/components/[page]/`
3. Add API calls in `src/lib/api/`
4. Update navigation in `src/components/layout/Navigation.tsx`

#### Backend API
1. Create entity in `entity/`
2. Create mapper in `mapper/`
3. Create service in `service/` and `service/impl/`
4. Create controller in `controller/`
5. Update `schema.sql` and `data.sql` if needed

### File Naming Patterns
- **React Components**: `ComponentName.tsx` (PascalCase)
- **Pages**: `page.tsx` (Next.js convention)
- **Utilities**: `utility-name.ts` (kebab-case)
- **Java Classes**: `ClassName.java` (PascalCase)
- **SQL Files**: `lowercase-with-dashes.sql`

## Key Directories to Know

- **Frontend source**: `frontend/src/`
- **UI components**: `frontend/src/components/ui/`
- **API client**: `frontend/src/lib/api/client.ts`
- **Backend dev app**: `backend/manqiyou-app/`
- **Backend controllers**: `backend/manqiyou-app/src/main/java/com/manqiyou/controller/`
- **Database init**: `backend/manqiyou-app/src/main/resources/schema.sql`
- **Brand assets**: `brand_assets/` (source) → `frontend/public/brand_assets/` (deployed)
