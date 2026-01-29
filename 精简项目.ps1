# 漫骑游项目精简脚本
# 用途：删除不必要的文件，为服务器部署做准备

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  漫骑游项目精简脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 确认操作
Write-Host "⚠️  警告：此脚本将删除以下类型的文件：" -ForegroundColor Yellow
Write-Host "   - 开发文档（PDF、说明书等）" -ForegroundColor Yellow
Write-Host "   - 安装指南" -ForegroundColor Yellow
Write-Host "   - 临时说明文档" -ForegroundColor Yellow
Write-Host "   - Windows 批处理脚本" -ForegroundColor Yellow
Write-Host "   - 密码备份文件" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  重要：删除前请确保密码已保存到安全的地方！" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "确认继续？(输入 YES 继续)"
if ($confirm -ne "YES") {
    Write-Host "已取消操作" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "开始精简项目..." -ForegroundColor Green
Write-Host ""

# 计数器
$deletedCount = 0
$failedCount = 0

# 删除函数
function Remove-FileIfExists {
    param($filePath)
    
    if (Test-Path $filePath) {
        try {
            Remove-Item $filePath -Force
            Write-Host "✓ 已删除: $filePath" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "✗ 删除失败: $filePath" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "- 不存在: $filePath" -ForegroundColor Gray
        return $null
    }
}

Write-Host ">>> 删除开发文档..." -ForegroundColor Cyan
$files = @(
    "漫骑游官方网站开发全案说明书.md",
    "漫骑游介绍.pdf",
    "漫骑游品牌手册.pdf",
    "内容优化方案.md",
    "SKILL.md",
    "spec-interview.md",
    "ENHANCEMENTS.md",
    "DEVELOPMENT.md"
)
foreach ($file in $files) {
    $result = Remove-FileIfExists $file
    if ($result -eq $true) { $deletedCount++ }
    elseif ($result -eq $false) { $failedCount++ }
}

Write-Host ""
Write-Host ">>> 删除安装指南..." -ForegroundColor Cyan
$files = @(
    "安装Git指南.md",
    "安装Git-快速命令.bat"
)
foreach ($file in $files) {
    $result = Remove-FileIfExists $file
    if ($result -eq $true) { $deletedCount++ }
    elseif ($result -eq $false) { $failedCount++ }
}

Write-Host ""
Write-Host ">>> 删除临时说明文档..." -ForegroundColor Cyan
$files = @(
    "开始部署-操作指南.md",
    "密码配置说明.md",
    "项目精简说明.md"
)
foreach ($file in $files) {
    $result = Remove-FileIfExists $file
    if ($result -eq $true) { $deletedCount++ }
    elseif ($result -eq $false) { $failedCount++ }
}

Write-Host ""
Write-Host ">>> 删除密码备份文件..." -ForegroundColor Cyan
Write-Host "⚠️  请确保密码已保存！" -ForegroundColor Yellow
$result = Remove-FileIfExists "PASSWORDS_BACKUP.txt"
if ($result -eq $true) { $deletedCount++ }
elseif ($result -eq $false) { $failedCount++ }

Write-Host ""
Write-Host ">>> 删除 Windows 批处理脚本..." -ForegroundColor Cyan
$files = @(
    "check-env.bat",
    "setup-assets.bat",
    "start-all.bat",
    "start-backend.bat",
    "start-frontend.bat"
)
foreach ($file in $files) {
    $result = Remove-FileIfExists $file
    if ($result -eq $true) { $deletedCount++ }
    elseif ($result -eq $false) { $failedCount++ }
}

Write-Host ""
Write-Host ">>> 删除开发环境 Docker 配置..." -ForegroundColor Cyan
$result = Remove-FileIfExists "docker-compose.yml"
if ($result -eq $true) { $deletedCount++ }
elseif ($result -eq $false) { $failedCount++ }

Write-Host ""
Write-Host ">>> 删除前端优化文档（可选）..." -ForegroundColor Cyan
$files = @(
    "frontend/QUICK_OPTIMIZATION_GUIDE.md",
    "frontend/OPTIMIZATION_SUMMARY.md",
    "frontend/PERFORMANCE_OPTIMIZATION.md"
)
foreach ($file in $files) {
    $result = Remove-FileIfExists $file
    if ($result -eq $true) { $deletedCount++ }
    elseif ($result -eq $false) { $failedCount++ }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  精简完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "统计信息：" -ForegroundColor Cyan
Write-Host "  已删除文件: $deletedCount 个" -ForegroundColor Green
Write-Host "  删除失败: $failedCount 个" -ForegroundColor Red
Write-Host ""

# 检查必要文件
Write-Host ">>> 检查必要文件..." -ForegroundColor Cyan
$requiredFiles = @(
    ".env.production",
    ".gitignore",
    "docker-compose.prod.yml",
    "README.md",
    "DEPLOYMENT_READY.md",
    "PROJECT_SUMMARY.md"
)

$allExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (缺失！)" -ForegroundColor Red
        $allExist = $false
    }
}

Write-Host ""
if ($allExist) {
    Write-Host "✓ 所有必要文件都存在" -ForegroundColor Green
} else {
    Write-Host "✗ 有必要文件缺失，请检查！" -ForegroundColor Red
}

Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Cyan
Write-Host "1. 查看更改: git status" -ForegroundColor White
Write-Host "2. 提交更改: git add . && git commit -m '精简项目文件'" -ForegroundColor White
Write-Host "3. 推送代码: git push origin main" -ForegroundColor White
Write-Host "4. 开始部署: 参考 deploy/阿里云部署完整方案.md" -ForegroundColor White
Write-Host ""

# 询问是否查看 Git 状态
$showGit = Read-Host "是否查看 Git 状态？(Y/N)"
if ($showGit -eq "Y" -or $showGit -eq "y") {
    Write-Host ""
    git status
}

Write-Host ""
Write-Host "精简脚本执行完成！" -ForegroundColor Green
Write-Host ""
