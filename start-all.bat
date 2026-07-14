@echo off
REM ============================================================================
REM  Ruyi AI Admin - one-click starter (Windows)
REM  Starts the Go backend (native .exe) and the Vite frontend dev server,
REM  then opens the app in your default browser.
REM ============================================================================
cd /d %~dp0
setlocal

REM make `go` reachable (adjust if your Go is installed elsewhere)
set "PATH=%PATH%;C:\Go\bin"

if not exist backend\bin\server.exe (
  echo [Ruyi] building backend (first run)...
  pushd backend
  go build -o bin\server.exe .
  if errorlevel 1 (
    echo [Ruyi] backend build FAILED - is Go installed at C:\Go?
    pause
    exit /b 1
  )
  popd
)

echo [Ruyi] starting backend on :8080 ...
start "Ruyi-Backend" cmd /k "cd /d %~dp0backend && bin\server.exe"

echo [Ruyi] starting frontend on :3000 ...
start "Ruyi-Frontend" cmd /k "cd /d %~dp0frontend && npm install --no-audit --no-fund && npm run dev"

echo [Ruyi] waiting for servers...
timeout /t 10 /nobreak >nul
start "" http://localhost:3000/

echo [Ruyi] open http://localhost:3000/  (login: admin / admin123)
echo [Ruyi] close the two opened terminal windows to stop the servers.
pause
endlocal
