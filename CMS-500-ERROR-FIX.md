# CMS Admin 500 Error Fix - 2026-02-06

## Problem
The CMS admin pages for Routes, Products, and Partners were all returning 500 errors when trying to load data, even after successful authentication.

## Root Cause
The entity classes (`Route.java`, `Product.java`, `Partner.java`) had a `version` field with `@Version` annotation for optimistic locking, but the database schema (`schema.sql`) was missing the `version` column in the corresponding tables:
- `cms_routes`
- `cms_products`
- `cms_partners`

This caused MyBatis-Plus to fail when trying to query these tables because it couldn't map the `version` field.

## Solution
Added the missing `version` column to all three tables in `backend/manqiyou-app/src/main/resources/schema.sql`:

```sql
version INT DEFAULT 0 NOT NULL,
```

The column was added with:
- Type: `INT`
- Default value: `0`
- Constraint: `NOT NULL`

## Changes Made
1. Updated `cms_routes` table definition to include `version` column
2. Updated `cms_products` table definition to include `version` column
3. Updated `cms_partners` table definition to include `version` column
4. Restarted backend service to apply schema changes (H2 in-memory database recreates on restart)

## Verification
Tested all three endpoints after the fix:

### Routes Endpoint
```bash
GET /api/admin/routes?page=1&limit=10
Response: {"code":200,"message":"success","data":{"records":[],"total":0,"size":10,"current":1,"pages":0}}
```

### Products Endpoint
```bash
GET /api/admin/products?page=1&limit=10
Response: {"code":200,"message":"success","data":{"records":[],"total":0,"size":10,"current":1,"pages":0}}
```

### Partners Endpoint
```bash
GET /api/admin/partners
Response: {"code":200,"message":"success","data":[]}
```

All endpoints now return 200 status with empty data (expected since no records exist yet).

## Status
✅ **FIXED** - All CMS admin endpoints are now working correctly.

## Next Steps
The CMS admin system is now ready for:
1. Creating new routes, products, and partners
2. Testing the full CRUD operations
3. Adding sample data for testing
