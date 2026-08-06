#!/usr/bin/env pwsh
# Start a feature in one command: NNN-name branch + specs dir + fresh snapshot.
# Usage: scripts/new-feature.ps1 "Add contract obligations endpoint" -ShortName obligations-api
[CmdletBinding()]
param(
    [string]$ShortName,
    [Parameter(Mandatory, Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$Description
)
$ErrorActionPreference = 'Stop'

$args2 = @()
if ($ShortName) { $args2 += @('-ShortName', $ShortName) }
& .specify/scripts/powershell/create-new-feature.ps1 @args2 @Description
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Fresh code context for the spec phase (brownfield-aware planning)
& .specify/scripts/powershell/new-codebase-snapshot.ps1

# Incremental graph refresh (blast-radius queries stay current)
if (Get-Command code-review-graph -ErrorAction SilentlyContinue) { code-review-graph update }
else { Write-Warning 'code-review-graph missing — run scripts/setup.ps1' }

Write-Host ''
Write-Host 'Feature ready. Pipeline:'
Write-Host '  /speckit-specify -> /speckit-clarify (loop) -> /speckit-checklist -> /speckit-plan'
Write-Host '  -> /speckit-review adversarial (GATE A) -> /speckit-tasks -> /speckit-analyze (loop)'
Write-Host '  -> /speckit-handoff (GATE B) -> /speckit-implement -> /speckit-review (GATE C) -> converge'
