#!/usr/bin/env pwsh
# Brownfield onboarding: build ground truth BEFORE the first /speckit-constitution.
# Full runbook: docs/brownfield.md
[CmdletBinding()]
param(
    [string]$ScanPath = 'src',
    [switch]$WithAudit   # also run the full audit loops via /audit-orchestrator afterwards (agent-driven)
)
$ErrorActionPreference = 'Stop'

Write-Host '== Brownfield onboarding =='

# 1. Compressed snapshot (spec/plan phases read THIS, never walk src/)
& .specify/scripts/powershell/new-codebase-snapshot.ps1

# 2. Full-file review scan (no git history needed) — OCR is part of the standard toolchain
if (-not (Get-Command ocr -ErrorAction SilentlyContinue)) {
    Write-Host 'ocr missing — installing (standard toolchain)...'
    npm install -g "@alibaba-group/open-code-review"
}
if (Test-Path $ScanPath) {
    Write-Host "Running ocr scan --path $ScanPath ..."
    ocr scan --path $ScanPath
    Write-Host 'Findings: ocr session comments --json --severity critical,high'
} else { Write-Warning "'$ScanPath' not found — pass -ScanPath <dir>" }

Write-Host ''
Write-Host 'Next steps (docs/brownfield.md):'
Write-Host '  1. /speckit-constitution — document REAL constraints (modules/integrations that must not break),'
Write-Host '     pick the persistence model (Living Spec recommended for brownfield) and record it.'
if ($WithAudit) { Write-Host '  2. /audit-orchestrator full — audit loops feed the constitution with evidence.' }
else            { Write-Host '  2. (optional) /audit-orchestrator full — evidence for the constitution.' }
Write-Host '  3. Normal pipeline per feature; /speckit-converge closes code<->spec drift each cycle.'
