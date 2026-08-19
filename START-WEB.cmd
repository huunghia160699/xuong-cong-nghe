@echo off
title Xuong Cong Nghe - Local Web
cd /d "%~dp0"

if not exist node_modules (
  echo Dang cai dat thu vien lan dau...
  call npm install
  if errorlevel 1 (
    echo Khong the cai dat thu vien. Hay kiem tra Node.js va ket noi mang.
    pause
    exit /b 1
  )
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
echo Dang khoi dong XUONG CONG NGHE tai http://localhost:3000
echo Giu cua so nay mo khi dang xem web. Nhan Ctrl+C de dung.
call npm run dev
