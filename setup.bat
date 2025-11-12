@echo off
REM AI Travel Planner - Quick Start Script for Windows

echo ============================================
echo  AI Travel Planner - Quick Start
echo ============================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js 18+ from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo.

REM Check if npm is installed
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [OK] npm version:
npm -v
echo.

REM Install root dependencies
echo [INFO] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
if not exist ".env" (
    echo [WARN] Creating frontend/.env from .env.example
    copy .env.example .env
    echo [WARN] Please edit frontend/.env and add your API keys
)
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
if not exist ".env" (
    echo [WARN] Creating backend/.env from .env.example
    copy .env.example .env
    echo [WARN] Please edit backend/.env and add your API keys
)
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ============================================
echo [OK] Installation complete!
echo ============================================
echo.
echo [IMPORTANT] Please configure your API keys:
echo   1. Edit backend\.env
echo   2. Edit frontend\.env
echo   3. Add your Supabase and other API keys
echo.
echo [INFO] To start the development server, run:
echo   npm run dev
echo.
echo [INFO] For more information, see README.md
echo.
pause
