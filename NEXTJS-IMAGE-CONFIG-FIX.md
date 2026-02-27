# Next.js Image Configuration Fix

## Issue

Frontend was showing error:
```
Unhandled Runtime Error
Error: Invalid src prop (http://localhost:3000/brand_assets/page1_img2.jpeg) on `next/image`, 
hostname "localhost" is not configured under images in your `next.config.js`
```

## Root Cause

Next.js Image component requires explicit configuration of allowed image hostnames for security. The config only had `localhost:8080/uploads/**` configured, but images were being loaded from `localhost:3000/brand_assets/**`.

## Solution

Updated `frontend/next.config.mjs` to add localhost:3000 to the allowed image domains:

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.aliyuncs.com',
  },
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '8080',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http',
    hostname: '127.0.0.1',
    port: '8080',
    pathname: '/uploads/**',
  },
  // NEW: Allow localhost:3000 for brand_assets
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
    pathname: '/brand_assets/**',
  },
  // NEW: Allow localhost without port for brand_assets
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '',
    pathname: '/brand_assets/**',
  },
],
```

## What This Fixes

- ✅ Images from `/brand_assets/**` can now load via Next.js Image component
- ✅ Both `localhost:3000` and `localhost` (no port) are allowed
- ✅ Maintains security by only allowing specific paths
- ✅ Works with the visual editor image preview

## Testing

After this fix:
1. Restart the frontend dev server (Ctrl+C and run `npm run dev` again)
2. Navigate to any page with images
3. Images should load without errors
4. Visual editor should work correctly

## Why This Happened

The visual editor loads images from the frontend's public directory (`/brand_assets/`), which are served by the Next.js dev server at `localhost:3000`. The Next.js Image component requires explicit permission to load images from any hostname, even localhost.

## Related Files

- `frontend/next.config.mjs` - Next.js configuration
- `frontend/public/brand_assets/` - Static image assets

## Next Steps

If you still see image loading issues:
1. Clear browser cache
2. Restart frontend dev server
3. Check browser console for any other errors
4. Verify images exist in `frontend/public/brand_assets/`

---

**Fixed**: 2026-02-14
**Issue Type**: Configuration
**Impact**: Visual editor and homepage image loading
