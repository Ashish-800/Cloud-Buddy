@echo off
REM ──────────────────────────────────────────────────────────────────
REM CloudCanvas – Dev Launcher (Windows)
REM ──────────────────────────────────────────────────────────────────
REM Starts both backend (FastAPI) and frontend (Next.js) concurrently.
REM Usage:  dev.bat
REM ──────────────────────────────────────────────────────────────────

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   CloudCanvas - AI System Design Tutor       ║
echo  ║   Starting development servers...            ║
echo  ╚══════════════════════════════════════════════╝
echo.

REM Check for .env
if not exist "backend\.env" (
    echo [WARN] backend\.env not found!
    echo        Copy backend\.env.example to backend\.env and add your GOOGLE_API_KEY
    echo.
)

REM Start backend
echo [1/2] Starting FastAPI backend on http://localhost:8000 ...
start "CloudCanvas-Backend" cmd /c "cd backend && pip install -r requirements.txt >nul 2>&1 && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM Small delay to let backend initialize
timeout /t 3 /nobreak >nul

REM Start frontend
echo [2/2] Starting Next.js frontend on http://localhost:3000 ...
start "CloudCanvas-Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo  ✓ Both servers starting in separate windows.
echo.
echo    Backend:  http://localhost:8000  (API docs: http://localhost:8000/docs)
echo    Frontend: http://localhost:3000
echo.
echo  Press any key to exit this launcher (servers continue running)...
pause >nul
