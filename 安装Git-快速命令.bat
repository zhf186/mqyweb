@echo off
chcp 65001 >nul
echo ========================================
echo Git 安装助手
echo ========================================
echo.
echo 请选择安装方式：
echo.
echo 1. 使用 Winget 安装（推荐 - Windows 11）
echo 2. 使用 Chocolatey 安装
echo 3. 打开官网下载页面
echo 4. 退出
echo.
set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" goto winget
if "%choice%"=="2" goto choco
if "%choice%"=="3" goto web
if "%choice%"=="4" goto end

:winget
echo.
echo ========================================
echo 使用 Winget 安装 Git
echo ========================================
echo.
echo 正在安装 Git...
winget install --id Git.Git -e --source winget
echo.
echo 安装完成！请关闭并重新打开 PowerShell
echo 然后运行: git --version
echo.
pause
goto end

:choco
echo.
echo ========================================
echo 使用 Chocolatey 安装 Git
echo ========================================
echo.
echo 检查 Chocolatey 是否已安装...
where choco >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Chocolatey 未安装！
    echo 请先安装 Chocolatey 或选择其他安装方式
    echo.
    echo 安装 Chocolatey:
    echo 1. 以管理员身份打开 PowerShell
    echo 2. 运行: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    echo.
    pause
    goto end
)
echo.
echo 正在安装 Git...
choco install git -y
echo.
echo 安装完成！请关闭并重新打开 PowerShell
echo 然后运行: git --version
echo.
pause
goto end

:web
echo.
echo ========================================
echo 打开 Git 官网下载页面
echo ========================================
echo.
echo 正在打开浏览器...
start https://git-scm.com/download/win
echo.
echo 请在浏览器中下载并安装 Git
echo 安装完成后，关闭并重新打开 PowerShell
echo 然后运行: git --version
echo.
pause
goto end

:end
echo.
echo 感谢使用！
echo.
pause
