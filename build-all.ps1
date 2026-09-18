$ErrorActionPreference = 'Stop'
Push-Location (Join-Path $PSScriptRoot 'frontend')
try {
    if (-not (Test-Path -LiteralPath 'node_modules')) {
        npm ci
        if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
    }
    npm run sync:releases
    if ($LASTEXITCODE -ne 0) { throw 'Release synchronization failed.' }
    npm test
    if ($LASTEXITCODE -ne 0) { throw 'Tests failed.' }
    npm run generate
    if ($LASTEXITCODE -ne 0) { throw 'Static generation failed.' }
    Write-Host 'Build complete: frontend/.output/public/' -ForegroundColor Green
} finally {
    Pop-Location
}
