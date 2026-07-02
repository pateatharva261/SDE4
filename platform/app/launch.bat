@echo off
REM Launches the System Design Mastery app on a local server and opens the browser.
REM Serves the parent (platform/) folder so the app can fetch lesson files.

cd /d "%~dp0.."
echo Starting local server at http://localhost:8080/app/
echo Press Ctrl+C in this window to stop the server.
start "" "http://localhost:8080/app/"
python -m http.server 8080
