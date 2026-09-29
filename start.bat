@echo off
echo ===================================================
echo Starting PolicyLens AI - Insurtech Comparison Agent
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://localhost:8000...
start "PolicyLens Backend" cmd /k "python -m uvicorn backend.main:app --port 8000 --reload"

echo [2/2] Launching Next.js Frontend on http://localhost:3000...
cd frontend
start "PolicyLens Frontend" cmd /k "npm run dev"

echo ===================================================
echo PolicyLens AI is starting!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo ===================================================
