#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# CloudCanvas – Dev Launcher (macOS / Linux)
# ──────────────────────────────────────────────────────────────────
# Starts both backend (FastAPI) and frontend (Next.js) concurrently.
# Usage:  chmod +x dev.sh && ./dev.sh
# ──────────────────────────────────────────────────────────────────

set -e

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   CloudCanvas - AI System Design Tutor       ║"
echo "  ║   Starting development servers...            ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# Check for .env
if [ ! -f "backend/.env" ]; then
    echo "[WARN] backend/.env not found!"
    echo "       Copy backend/.env.example to backend/.env and add your GOOGLE_API_KEY"
    echo ""
fi

# Cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start backend
echo "[1/2] Starting FastAPI backend on http://localhost:8000 ..."
(cd backend && pip install -q -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "[2/2] Starting Next.js frontend on http://localhost:3000 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "  ✓ Both servers running."
echo ""
echo "    Backend:  http://localhost:8000  (API docs: http://localhost:8000/docs)"
echo "    Frontend: http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

wait
