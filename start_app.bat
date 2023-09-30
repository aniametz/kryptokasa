@echo off

start cmd.exe /K "npm start"
timeout /t 3

rem Start Flask backend
start cmd.exe /K "cd C:\repos\kryptokasa_front\kryptokasa\src && .\Aptiv_Kryptokasa\Scripts\activate && python .\Aptiv_Kryptokasa\main.py"

rem A delay to ensure Flask initializes
timeout /t 3

rem Start Electron frontend
cd "C:\repos\kryptokasa_front\kryptokasa"
npm run electron-dev
