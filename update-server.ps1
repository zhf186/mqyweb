# MQYWeb production update script
# Usage:
#   .\update-server.ps1
#   .\update-server.ps1 -ServerIp "1.2.3.4" -ServerUser "root" -ProjectDir "/opt/mqyweb"

param(
    [string]$ServerIp = "47.97.21.33",
    [string]$ServerUser = "root",
    [string]$ProjectDir = "/opt/mqyweb"
)

$ErrorActionPreference = "Stop"
$remote = "$ServerUser@$ServerIp"

function Invoke-RemoteStep {
    param(
        [string]$StepLabel,
        [string]$RemoteCommand
    )

    Write-Host "[$StepLabel] $RemoteCommand"
    ssh $remote $RemoteCommand

    if ($LASTEXITCODE -ne 0) {
        throw "Step $StepLabel failed. Exit code: $LASTEXITCODE"
    }
}

Write-Host "=========================================="
Write-Host "MQYWeb production update"
Write-Host "=========================================="
Write-Host "Server : $remote"
Write-Host "Path   : $ProjectDir"
Write-Host ""

try {
    Invoke-RemoteStep -StepLabel "1/4" -RemoteCommand "cd '$ProjectDir' && git pull --ff-only origin main"
    Write-Host ""

    Invoke-RemoteStep -StepLabel "2/4" -RemoteCommand "cd '$ProjectDir' && docker-compose -f docker-compose.prod.yml rm -sf backend frontend"
    Write-Host ""

    Invoke-RemoteStep -StepLabel "3/4" -RemoteCommand "cd '$ProjectDir' && docker-compose -f docker-compose.prod.yml up -d --build backend frontend"
    Write-Host ""

    Start-Sleep -Seconds 10
    Invoke-RemoteStep -StepLabel "4/4" -RemoteCommand "cd '$ProjectDir' && docker-compose -f docker-compose.prod.yml ps"
    Write-Host ""

    Write-Host "=========================================="
    Write-Host "Update completed"
    Write-Host "=========================================="
    Write-Host "Site: https://www.zjmqy.cc"
    Write-Host ""
}
catch {
    Write-Host "=========================================="
    Write-Host "Update failed"
    Write-Host "=========================================="
    Write-Error $_
    exit 1
}
