@echo off
setlocal
title Xuong Cong Nghe - Local Demo (khong can Vercel)
cd /d "%~dp0"
if not exist "node_modules\next" (
 echo Chua cai thu vien. Khi co Internet: corepack pnpm install --frozen-lockfile
 pause
 exit /b 1
)
if not exist ".env.local" if exist ".env.example" copy ".env.example" ".env.local" >nul
set "NEXT_PUBLIC_USE_MOCK_DATA=true"
set "NEXT_PUBLIC_APP_URL=http://localhost:3000"
echo Dang chay ban DEMO tai http://localhost:3000
echo Khong su dung Supabase Production. Nhan Ctrl+C de dung.
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"
call node_modules\.bin\next.cmd dev
endlocal
