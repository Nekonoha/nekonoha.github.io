# Build script for local testing
# This script builds both frontend and auto-battler

Write-Host "Building nekonoha.github.io with auto-battler..." -ForegroundColor Cyan

# Build frontend
Write-Host "`n[1/3] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}
npm install
npm run generate

# Build auto-battler
Write-Host "`n[2/3] Building auto-battler..." -ForegroundColor Yellow
Set-Location ..\auto-battler
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}
npm install
$env:NUXT_APP_BASE_URL="/auto-battler/"
npm run generate

# Copy auto-battler to frontend dist
Write-Host "`n[3/3] Copying auto-battler to frontend dist..." -ForegroundColor Yellow
Set-Location ..
New-Item -ItemType Directory -Force -Path "frontend/dist/auto-battler" | Out-Null
Copy-Item -Recurse -Force "auto-battler/.output/public/*" "frontend/dist/auto-battler/"

Write-Host "`nBuild complete! Check frontend/dist/" -ForegroundColor Green
Write-Host "To preview: cd frontend/dist && npx serve" -ForegroundColor Cyan
