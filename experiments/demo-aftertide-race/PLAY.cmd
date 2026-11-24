@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required to run Aftertide.
  pause
  exit /b 1
)
if not exist "node_modules\three\build\three.module.js" (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
node tools\serve.mjs --open
if errorlevel 1 pause
