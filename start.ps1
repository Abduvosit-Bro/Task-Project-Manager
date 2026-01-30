# Скрипт для запуска всех сервисов проекта

Write-Host "Запуск проекта Task & Project Manager..." -ForegroundColor Green

# Проверка Docker
Write-Host "`n1. Проверка Docker контейнеров..." -ForegroundColor Yellow
docker compose up -d
Start-Sleep -Seconds 2

# Запуск Django Backend
Write-Host "`n2. Запуск Django Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\.venv\Scripts\Activate.ps1; python manage.py runserver" -WindowStyle Normal

Start-Sleep -Seconds 3

# Запуск Celery Worker
Write-Host "`n3. Запуск Celery Worker..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\.venv\Scripts\Activate.ps1; celery -A config.celery worker -l info -P solo -c 1" -WindowStyle Normal

Start-Sleep -Seconds 2

# Запуск Celery Beat
Write-Host "`n4. Запуск Celery Beat..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\.venv\Scripts\Activate.ps1; celery -A config.celery beat -l info" -WindowStyle Normal

Start-Sleep -Seconds 2

# Запуск Frontend
Write-Host "`n5. Запуск Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; `$env:PATH = '$frontendPath\node_modules\.bin;' + `$env:PATH; node node_modules\vite\bin\vite.js --port 5173 --host" -WindowStyle Normal

Write-Host "`n✓ Все сервисы запущены!" -ForegroundColor Green
Write-Host "`nДоступ к приложению:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:8000/api/docs/" -ForegroundColor White
Write-Host "`nДемо-аккаунт: demo@example.com / password123" -ForegroundColor Cyan
