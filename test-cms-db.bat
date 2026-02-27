@echo off
echo ========================================
echo 测试 CMS 数据库初始化
echo ========================================
echo.

echo 1. 停止现有容器...
docker-compose down

echo.
echo 2. 删除数据库卷（重新初始化）...
docker volume rm manqiyou_postgres_data 2>nul

echo.
echo 3. 启动 PostgreSQL 容器...
docker-compose up -d postgres

echo.
echo 4. 等待数据库启动（30秒）...
timeout /t 30 /nobreak

echo.
echo 5. 检查 CMS 表是否创建成功...
docker exec -it manqiyou-postgres psql -U postgres -d manqiyou -c "\dt cms_*"

echo.
echo 6. 检查管理员账号是否创建...
docker exec -it manqiyou-postgres psql -U postgres -d manqiyou -c "SELECT username, email, role FROM cms_admin_users;"

echo.
echo 7. 检查页面数据是否初始化...
docker exec -it manqiyou-postgres psql -U postgres -d manqiyou -c "SELECT slug, name_zh, name_en FROM cms_pages;"

echo.
echo 8. 检查内容项数量...
docker exec -it manqiyou-postgres psql -U postgres -d manqiyou -c "SELECT COUNT(*) as content_items_count FROM cms_content_items;"

echo.
echo ========================================
echo 测试完成！
echo ========================================
echo.
echo 默认管理员账号:
echo   用户名: admin
echo   密码: Admin@123
echo   邮箱: admin@manqiyou.com
echo.
pause
