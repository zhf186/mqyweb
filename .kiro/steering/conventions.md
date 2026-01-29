# Code Conventions & Best Practices

## General Principles

### Code Style
- **Consistency**: Follow existing patterns in the codebase
- **Readability**: Prioritize clear, self-documenting code over clever solutions
- **Modularity**: Keep components and functions focused on single responsibilities
- **Type Safety**: Leverage TypeScript and Java type systems fully

## Frontend Conventions

### React/Next.js Patterns

#### Component Structure
```tsx
// 1. Imports (grouped: React, external libs, internal, types)
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { RouteData } from '@/types'

// 2. Types/Interfaces
interface ComponentProps {
  title: string
  data: RouteData[]
}

// 3. Component
export function Component({ title, data }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState()
  
  // 5. Handlers
  const handleClick = () => {}
  
  // 6. Render
  return <div>...</div>
}
```

#### State Management
- **Local state**: `useState` for component-specific state
- **Global state**: Zustand stores for cross-component state
- **Server state**: React Query for API data
- **Form state**: React Hook Form for forms

#### Styling
- Use Tailwind utility classes directly in JSX
- Extract repeated patterns into reusable components
- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design

#### Performance
- Use `'use client'` directive only when necessary (interactivity, hooks)
- Prefer Server Components for static content
- Lazy load heavy components with `dynamic()`
- Optimize images with Next.js `<Image>` component

### TypeScript Guidelines
- Define explicit types for props, API responses, and state
- Use interfaces for object shapes, types for unions/primitives
- Avoid `any` - use `unknown` if type is truly unknown
- Export types from dedicated `types/` files

### API Integration
- All API calls go through `lib/api/client.ts`
- Handle loading, error, and success states
- Use React Query for caching and refetching
- Include proper error messages for users

## Backend Conventions

### Spring Boot Patterns

#### Controller Layer
```java
@RestController
@RequestMapping("/api/routes")
public class RouteController {
    
    @Autowired
    private RouteService routeService;
    
    @GetMapping
    public Result<List<Route>> list() {
        return Result.success(routeService.list());
    }
    
    @GetMapping("/{id}")
    public Result<Route> getById(@PathVariable Long id) {
        return Result.success(routeService.getById(id));
    }
}
```

#### Service Layer
- Interface + Implementation pattern
- Business logic lives here, not in controllers
- Use `@Transactional` for multi-step operations
- Validate inputs and throw meaningful exceptions

#### Data Access
- Use MyBatis-Plus for CRUD operations
- Custom queries in Mapper XML files
- Entity classes match database tables exactly
- Use Lombok to reduce boilerplate

### Java Code Style
- Follow standard Java naming conventions
- Use meaningful variable and method names
- Keep methods short and focused
- Add JavaDoc for public APIs

### Error Handling
- Use custom exceptions for business logic errors
- Return `Result<T>` wrapper for API responses
- Log errors appropriately (debug, info, warn, error)
- Provide user-friendly error messages

## Database Conventions

### Schema Design
- Use snake_case for table and column names
- Include `id`, `created_at`, `updated_at` in all tables
- Use foreign keys for relationships
- Add indexes for frequently queried columns

### Migrations
- Development: Update `schema.sql` and `data.sql`
- Production: Use Flyway or Liquibase for versioned migrations
- Always test migrations on sample data first

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages
```
type(scope): brief description

Longer explanation if needed

- Bullet points for details
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### Pull Requests
- Keep PRs focused and reasonably sized
- Include description of changes and testing done
- Update relevant documentation
- Ensure tests pass before requesting review

## Testing Guidelines

### Frontend Tests
- Test user interactions, not implementation details
- Mock API calls in component tests
- Use data-testid for test selectors
- Aim for meaningful coverage, not 100%

### Backend Tests
- Unit tests for service layer logic
- Integration tests for API endpoints
- Use property-based testing (jqwik) for complex logic
- Mock external dependencies

## Documentation

### Code Comments
- Explain "why", not "what" (code should be self-explanatory)
- Document complex algorithms or business rules
- Keep comments up-to-date with code changes
- Use JSDoc/JavaDoc for public APIs

### README Updates
- Document new features and configuration
- Update setup instructions if dependencies change
- Include examples for common use cases
- Keep deployment docs current

## Security Best Practices

### Frontend
- Never expose secrets in client code
- Validate and sanitize user inputs
- Use HTTPS in production
- Implement proper CORS policies

### Backend
- Validate all inputs at controller level
- Use parameterized queries (MyBatis handles this)
- Implement proper authentication/authorization
- Hash passwords with BCrypt
- Rate limit sensitive endpoints

## Internationalization (i18n)

### Text Content
- All user-facing text goes through i18n system
- Use descriptive keys: `routes.detail.title` not `t1`
- Provide both Chinese and English translations
- Consider text length differences in UI design

### Date/Time Formatting
- Use locale-aware formatting
- Store dates in UTC, display in user's timezone
- Use ISO 8601 format for API communication

## Accessibility

### Frontend
- Use semantic HTML elements
- Include alt text for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Performance Optimization

### Frontend
- Minimize bundle size (check with `npm run build`)
- Lazy load routes and heavy components
- Optimize images (WebP, proper sizing)
- Use React.memo() judiciously
- Implement virtual scrolling for long lists

### Backend
- Use database indexes appropriately
- Implement pagination for large datasets
- Cache frequently accessed data (Redis)
- Use connection pooling
- Monitor query performance

## Deployment Checklist

### Before Deploying
- [ ] Run all tests locally
- [ ] Check for console errors/warnings
- [ ] Test on multiple browsers/devices
- [ ] Verify environment variables are set
- [ ] Review security configurations
- [ ] Update version numbers
- [ ] Create deployment backup plan

### After Deploying
- [ ] Verify application starts correctly
- [ ] Test critical user flows
- [ ] Check logs for errors
- [ ] Monitor performance metrics
- [ ] Verify SSL certificates
- [ ] Test API endpoints

## Common Pitfalls to Avoid

### Frontend
- ❌ Forgetting `'use client'` for interactive components
- ❌ Not handling loading/error states
- ❌ Hardcoding API URLs (use env variables)
- ❌ Ignoring TypeScript errors
- ❌ Not optimizing images

### Backend
- ❌ Exposing sensitive data in API responses
- ❌ Not validating user inputs
- ❌ Forgetting to handle null/empty cases
- ❌ Not using transactions for multi-step operations
- ❌ Hardcoding configuration values

### General
- ❌ Committing secrets or credentials
- ❌ Not testing before pushing
- ❌ Ignoring linter warnings
- ❌ Not updating documentation
- ❌ Skipping code reviews
