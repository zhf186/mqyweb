@echo off
chcp 65001 >nul
echo ==========================================
echo   漫骑游开发环境检测
echo ==========================================
echo.

set HAS_ERROR=0

echo [检测 Node.js]
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do echo   ✓ Node.js 已安装: %%i
) else (
    echo   ✗ Node.js 未安装
    echo     请访问 https://nodejs.org/ 下载安装 LTS 版本
    set HAS_ERROR=1
)
echo.

echo [检测 npm]
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do echo   ✓ npm 已安装: %%i
) else (
    echo   ✗ npm 未安装 (通常随 Node.js 一起安装)
    set HAS_ERROR=1
)
echo.

echo [检测 Java]
where java >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do echo   ✓ Java 已安装: %%i
) else (
    echo   ✗ Java 未安装
    echo     请访问 https://adoptium.net/ 下载安装 Temurin 17
    set HAS_ERROR=1
)
echo.

echo [检测 Maven (可选)]
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=3" %%i in ('mvn --version 2^>^&1 ^| findstr /i "Apache Maven"') do echo   ✓ Maven 已安装: %%i
) else (
    echo   - Maven 未全局安装 (项目包含 Maven Wrapper，可正常使用)
)
echo.

echo [检测品牌素材]
if exist "frontend\public\brand_assets\page1_img1.jpeg" (
    echo   ✓ 品牌素材已复制到前端
) else (
    echo   ✗ 品牌素材未复制
    echo     请运行 setup-assets.bat
    set HAS_ERROR=1
)
echo.

echo ==========================================
if %HAS_ERROR% EQU 0 (
    echo   ✓ 环境检测通过！可以启动项目
    echo.
    echo   启动命令:
    echo     start-all.bat      - 同时启动前后端
    echo     start-frontend.bat - 仅启动前端
    echo     start-backend.bat  - 仅启动后端
) else (
    echo   ✗ 请先安装缺失的依赖
)
echo ==========================================
echo.

pause
