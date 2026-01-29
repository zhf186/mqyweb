@echo off
setlocal

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.1.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

set MAVEN_VERSION=3.9.6
set MAVEN_HOME=%USERPROFILE%\.m2\apache-maven-%MAVEN_VERSION%
set MAVEN_BIN=%MAVEN_HOME%\bin\mvn.cmd

if not exist "%MAVEN_BIN%" (
    echo Maven not found. Downloading Maven %MAVEN_VERSION%...
    
    if not exist "%USERPROFILE%\.m2" mkdir "%USERPROFILE%\.m2"
    
    echo Downloading Maven...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile '%USERPROFILE%\.m2\maven.zip' -UseBasicParsing"
    
    if exist "%USERPROFILE%\.m2\maven.zip" (
        echo Extracting...
        powershell -Command "Expand-Archive -Path '%USERPROFILE%\.m2\maven.zip' -DestinationPath '%USERPROFILE%\.m2' -Force"
        del "%USERPROFILE%\.m2\maven.zip"
        echo Maven installed to %MAVEN_HOME%
    ) else (
        echo Download failed. Please install Maven manually:
        echo 1. Download from: https://maven.apache.org/download.cgi
        echo 2. Extract to: %MAVEN_HOME%
        echo 3. Run this script again
        pause
        exit /b 1
    )
)

echo Starting Spring Boot application...
call "%MAVEN_BIN%" spring-boot:run

endlocal
