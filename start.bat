@echo off
echo Starting BASAKcut (FastAPI + React Vite)...
start cmd /k "cd backend && pip install -r requirements.txt -q && uvicorn main:app --reload --port 8000"
start cmd /k "cd frontend && npm install -q && npm run dev"
echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173
pause
