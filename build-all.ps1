# Build script for local testing
# This script builds frontend, auto-battler, and visual-tool

Write-Host "Building nekonoha.github.io with auto-battler and visual-tool..." -ForegroundColor Cyan

# Build frontend
Write-Host "`n[1/5] Building frontend..." -ForegroundColor Yellow
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
Write-Host "`n[2/5] Building auto-battler..." -ForegroundColor Yellow
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

# Build visual-tool
Write-Host "`n[3/5] Building visual-tool..." -ForegroundColor Yellow
Set-Location ..\visual-tool
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}
npm install
$env:NUXT_APP_BASE_URL="/visual-tool/"
npm run generate

# Copy subprojects to frontend dist
Write-Host "`n[4/5] Copying auto-battler to frontend dist..." -ForegroundColor Yellow
Set-Location ..
New-Item -ItemType Directory -Force -Path "frontend/dist/auto-battler" | Out-Null
Copy-Item -Recurse -Force "auto-battler/.output/public/*" "frontend/dist/auto-battler/"

Write-Host "`n[5/5] Copying visual-tool to frontend dist..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "frontend/dist/visual-tool" | Out-Null
Copy-Item -Recurse -Force "visual-tool/.output/public/*" "frontend/dist/visual-tool/"

Write-Host "`nBuild complete! Check frontend/dist/" -ForegroundColor Green
Write-Host "To preview: cd frontend/dist && npx serve" -ForegroundColor Cyan
