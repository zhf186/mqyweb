# 漫骑游项目 - 上传到服务器脚本 (Windows PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$false)]
    [string]$TargetPath = "/var/www/manqiyou"
)

Write-Host "=========================================="
Write-Host "  漫骑游项目 - 上传到服务器"
Write-Host "==========================================" -ForegroundColor Blue
Write-Host ""

# 检查 rsync 是否可用
$rsyncAvailable = Get-Command rsync -ErrorAction SilentlyContinue

if (-not $rsyncAvailable) {
    Write-Host "警告: rsync 未安装，将使用 SCP 上传（较慢）" -ForegroundColor Yellow
    Write-Host "建议安装 rsync: https://github.com/Tech-TTGames/Rsync-Installer-For-Windows" -ForegroundColor Yellow
    Write-Host ""
    
    # 使用 SCP 上传
    Write-Host "步骤 1/3: 压缩项目文件..." -ForegroundColor Green
    
    # 排除不需要的文件
    $excludeFiles = @(
        "node_modules",
        "target",
        ".git",
        ".next",
        "*.log",
        ".env.local"
    )
    
    $tempFile = "manqiyou-deploy.tar.gz"
    
    # 使用 tar 压缩（需要 Windows 10 1803+）
    tar -czf $tempFile --exclude=node_modules --exclude=target --exclude=.git --exclude=.next .
    
    Write-Host "步骤 2/3: 上传到服务器..." -ForegroundColor Green
    scp $tempFile "${Username}@${ServerIP}:${TargetPath}/"
    
    Write-Host "步骤 3/3: 在服务器上解压..." -ForegroundColor Green
    ssh "${Username}@${ServerIP}" "cd ${TargetPath} && tar -xzf $tempFile && rm $tempFile"
    
    # 删除本地临时文件
    Remove-Item $tempFile
    
} else {
    # 使用 rsync 上传（推荐）
    Write-Host "使用 rsync 同步文件..." -ForegroundColor Green
    
    rsync -avz --progress `
        --exclude 'node_modules' `
        --exclude 'target' `
        --exclude '.git' `
        --exclude '.next' `
        --exclude '*.log' `
        --exclude '.env.local' `
        ./ "${Username}@${ServerIP}:${TargetPath}/"
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  上传完成！"
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "  1. SSH 登录服务器: ssh ${Username}@${ServerIP}"
Write-Host "  2. 进入项目目录: cd ${TargetPath}"
Write-Host "  3. 运行部署脚本: bash deploy/deploy.sh"
Write-Host ""

# 询问是否立即部署
$deploy = Read-Host "是否立即在服务器上运行部署脚本？(y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "正在服务器上运行部署脚本..." -ForegroundColor Green
    ssh -t "${Username}@${ServerIP}" "cd ${TargetPath} && bash deploy/deploy.sh"
}
