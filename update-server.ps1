# 漫骑游项目 - 服务器更新脚本
# 使用方法: .\update-server.ps1

$SERVER_IP = "47.97.21.33"
$PROJECT_DIR = "/opt/mqyweb"

Write-Host "=========================================="
Write-Host "漫骑游项目 - 服务器更新"
Write-Host "=========================================="
Write-Host ""

Write-Host "[1/4] 连接到服务器并拉取最新代码..."
ssh root@$SERVER_IP "cd $PROJECT_DIR && git pull origin main"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 代码更新成功" -ForegroundColor Green
} else {
    Write-Host "✗ 代码更新失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[2/4] 重新构建 Docker 镜像..."
ssh root@$SERVER_IP "cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml build"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 镜像构建成功" -ForegroundColor Green
} else {
    Write-Host "✗ 镜像构建失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[3/4] 重启服务..."
ssh root@$SERVER_IP "cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml up -d"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 服务重启成功" -ForegroundColor Green
} else {
    Write-Host "✗ 服务重启失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[4/4] 验证服务状态..."
Start-Sleep -Seconds 10

ssh root@$SERVER_IP "cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml ps"
Write-Host ""

Write-Host "=========================================="
Write-Host "更新完成！"
Write-Host "=========================================="
Write-Host ""
Write-Host "访问地址: http://www.manqiyou.cn"
Write-Host ""
Write-Host "查看日志:"
Write-Host "  ssh root@$SERVER_IP"
Write-Host "  cd $PROJECT_DIR"
Write-Host "  docker-compose -f docker-compose.prod.yml logs -f"
Write-Host ""
