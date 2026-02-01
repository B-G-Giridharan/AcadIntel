@echo off
echo ================================
echo   AcadIntel - Full Stack Setup
echo ================================
echo.

echo [1/4] Setting up Python backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Starting backend server...
start cmd /k "cd /d %CD% && venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

cd ..

echo.
echo [3/4] Installing frontend dependencies...
call npm install

echo.
echo [4/4] Starting frontend server...
start cmd /k "npm run dev"

echo.
echo ================================
echo   Setup Complete!
echo ================================
echo.
echo Backend running at: http://localhost:8000
echo Frontend running at: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
