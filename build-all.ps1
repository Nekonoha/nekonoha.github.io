# Build script for local testing
# This script builds the frontend.

Write-Host "Building nekonoha.github.io..." -ForegroundColor Cyan

# Build frontend
Write-Host "`nBuilding frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}
npm install
npm run generate

Write-Host "`nBuild complete! Check frontend/dist/" -ForegroundColor Green
Write-Host "To preview: cd frontend/dist && npx serve" -ForegroundColor Cyan
