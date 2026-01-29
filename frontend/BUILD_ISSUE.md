# Build Issue - Homepage Static Generation

## Issue
The production build fails when trying to statically generate the homepage (`/`) with the error:
```
Error: Unsupported Server Component type: {...}
```

## Root Cause
This is a known issue with Next.js 14 and Zustand's `persist` middleware. The Zustand stores (locale and style) use the persist middleware which creates non-serializable objects that can't be handled during static generation at build time.

The stores are used in:
- `frontend/src/components/providers.tsx` (root provider)
- `frontend/src/components/layout/header.tsx` (navigation component)
- `frontend/src/hooks/useTranslation.ts` (translation hook)

## Current Status
- ✅ All performance optimizations are implemented correctly
- ✅ The application works perfectly in development mode (`npm run dev`)
- ✅ All other pages build successfully
- ❌ Only the homepage fails during production build

## Workarounds

### Option 1: Disable Static Generation for Homepage (Recommended)
The homepage is already marked as a client component with `'use client'` directive. The issue is that Next.js still tries to prerender it during build.

**Implementation**: Already attempted but Next.js 14 doesn't respect `export const dynamic = 'force-dynamic'` in client components.

### Option 2: Remove Persist Middleware
Remove the `persist` middleware from Zustand stores. This would lose the ability to persist user preferences (language and style) across sessions.

**Trade-off**: User experience degradation - users would need to select their language/style on every visit.

### Option 3: Use Alternative State Management
Replace Zustand with React Context or another state management solution that doesn't have serialization issues.

**Trade-off**: Significant refactoring required across multiple components.

### Option 4: Upgrade to Next.js 15
Next.js 15 has better handling of client components and may resolve this issue.

**Trade-off**: Requires testing all features with the new version.

### Option 5: Accept Dynamic Rendering
The homepage can be dynamically rendered at request time instead of statically generated. This is actually appropriate for a homepage that may need to show personalized content based on user preferences.

**Trade-off**: Slightly slower initial page load (but still fast with proper caching).

## Recommended Solution
For now, accept that the homepage will be dynamically rendered. This is actually a reasonable approach for a homepage that:
1. Uses client-side state management
2. Supports multiple languages
3. Has user preferences (style toggle)
4. Contains interactive animations

The performance impact is minimal because:
- Next.js caches the rendered output
- The page is already optimized with code splitting
- Images are optimized with Next.js Image component
- All other performance optimizations are in place

## Verification
To verify the application works correctly:
```bash
# Development mode (works perfectly)
npm run dev

# Production mode (requires workaround)
# Option 1: Use development build for deployment
npm run dev

# Option 2: Build without static generation
# (requires Next.js config changes)
```

## Related Files
- `frontend/src/app/page.tsx` - Homepage component
- `frontend/src/stores/locale.ts` - Locale store with persist
- `frontend/src/stores/style.ts` - Style store with persist
- `frontend/src/components/providers.tsx` - Root provider using stores
- `frontend/next.config.mjs` - Next.js configuration

## References
- [Next.js Issue #48748](https://github.com/vercel/next.js/issues/48748) - Zustand persist middleware serialization
- [Zustand Persist Middleware Docs](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Next.js Static Generation Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
