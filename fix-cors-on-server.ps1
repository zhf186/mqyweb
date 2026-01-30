# 修复服务器上的 CORS 重复头问题
# 上传修复脚本并执行

$SERVER_IP = "47.97.21.33"
$SERVER_USER = "root"
$PROJECT_DIR = "/opt/mqyweb"

Write-Host "=== 修复服务器 CORS 重复头问题 ===" -ForegroundColor Green
Write-Host ""

# 1. 上传修复脚本
Write-Host "1. 上传修复脚本到服务器..." -ForegroundColor Yellow
scp fix-cors-duplicate.sh "${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}/"
scp verify-cors-config.sh "${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}/"
scp "CORS重复头修复方案.md" "${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "上传失败！" -ForegroundColor Red
    exit 1
}

Write-Host "✓ 脚本上传成功" -ForegroundColor Green
Write-Host ""

# 2. 先验证当前配置
Write-Host "2. 验证当前 CORS 配置..." -ForegroundColor Yellow
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${PROJECT_DIR}; chmod +x verify-cors-config.sh; ./verify-cors-config.sh"

Write-Host ""
Write-Host "按任意键继续执行修复，或 Ctrl+C 取消..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 3. 执行修复
Write-Host ""
Write-Host "3. 执行 CORS 修复..." -ForegroundColor Yellow
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${PROJECT_DIR}; chmod +x fix-cors-duplicate.sh; ./fix-cors-duplicate.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "修复执行失败！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== 修复完成 ===" -ForegroundColor Green
Write-Host ""
Write-Host "请执行以下操作验证修复：" -ForegroundColor Cyan
Write-Host "1. 访问 https://www.manqiyou.cn/routes"
Write-Host "2. 打开浏览器开发者工具（F12）"
Write-Host "3. 刷新页面（Ctrl+Shift+R 硬刷新）"
Write-Host "4. 检查控制台是否还有 CORS 错误"
Write-Host "5. 检查网络标签中 API 请求的响应头"
Write-Host ""
Write-Host "预期结果：" -ForegroundColor Cyan
Write-Host "- 没有 CORS 错误"
Write-Host "- API 请求返回 200 OK"
Write-Host "- 响应头中只有一个 access-control-allow-origin 值"
Write-Host ""
