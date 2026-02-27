# Image Upload 403 Error Fix

## Issue
When attempting to upload images in the CMS admin panel, the upload failed with:
```
POST http://localhost:8080/api/admin/assets/upload net::ERR_ABORTED 403 (Forbidden)
```

## Root Cause
The error was caused by **Maximum upload size exceeded**. Spring Boot's default maximum upload size is 1MB, which was too small for typical image files.

Backend logs showed:
```
org.springframework.web.multipart.MaxUploadSizeExceededException: Maximum upload size exceeded
```

The 403 Forbidden error was a secondary issue - when Spring Boot encounters the upload size exception, it redirects to `/error`, which triggers the security filter without proper authentication context.

## Solution
Added file upload size configuration to `backend/manqiyou-app/src/main/resources/application.yml`:

```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB      # Single file max 10MB
      max-request-size: 50MB   # Total request max 50MB (supports batch upload)
```

## Changes Made
1. Updated `application.yml` with multipart upload configuration
2. Restarted backend service to apply changes

## Testing
After the fix:
1. Login to admin panel: http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `Admin@123`
2. Navigate to Image Management (图片管理)
3. Select or drag images (up to 10MB each)
4. Click "开始上传" (Start Upload)
5. Upload should now succeed

## Configuration Details
- **Single file limit**: 10MB (suitable for high-quality images)
- **Batch upload limit**: 50MB total (supports uploading multiple images at once)
- **Supported formats**: JPG, PNG, GIF, WebP (validated in frontend)

## Related Files
- `backend/manqiyou-app/src/main/resources/application.yml` - Upload configuration
- `frontend/src/lib/api/admin.ts` - Upload API client (uploadAssets method)
- `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/controller/AssetController.java` - Upload endpoint

## Date
2026-02-04 12:43

## Status
✅ Fixed - Image upload now works correctly with files up to 10MB
