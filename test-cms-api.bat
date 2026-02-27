@echo off
echo Testing CMS API...
echo.

echo Getting admin token...
curl -X POST http://localhost:8080/api/admin/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"Admin@123\"}" > token.json
echo.

echo Getting page content...
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTczOTI2NTYwMCwiZXhwIjoxNzM5MzUyMDAwfQ.test" http://localhost:8080/api/admin/content/pages/1
echo.

pause
