@echo off
echo Starting local development server for Kaneez Creations...
echo.
echo Store URL:        http://localhost:8000
echo Admin Panel URL:  http://localhost:8000/admin.html
echo.
echo Opening live store in your default browser...
start "" http://localhost:8000
python server.py
pause
