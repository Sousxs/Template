#!/usr/bin/env pwsh
# Regenerate the compressed codebase snapshot (.specify/memory/codebase-snapshot.xml).
# Config lives in repomix.config.json (compress: true ≈ 70% token cut; Secretlint scan on).
# Agents grep this file (or use the repomix MCP server) instead of dumping directories.
$ErrorActionPreference = 'Stop'
Write-Host 'Generating codebase snapshot via repomix...'
npx -y repomix
if ($LASTEXITCODE -ne 0) { Write-Error "repomix failed (exit $LASTEXITCODE)"; exit $LASTEXITCODE }
$out = '.specify/memory/codebase-snapshot.xml'
if (Test-Path $out) {
    $kb = [math]::Round((Get-Item $out).Length / 1KB)
    Write-Host "Snapshot ready: $out (${kb} KB). Regenerate per feature branch — it goes stale."
}
