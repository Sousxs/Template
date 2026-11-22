#!/usr/bin/env pwsh
# Brownfield onboarding: build ground truth BEFORE the first /speckit-constitution.
# Full runbook: docs/brownfield.md
[CmdletBinding()]
param(
    [switch]$WithAudit   # also run /audit full afterwards (agent-driven)
)
$ErrorActionPreference = 'Stop'

Write-Host '== Brownfield onboarding =='

# 1. Compressed snapshot (spec/plan phases read THIS, never walk src/)
& .specify/scripts/powershell/new-codebase-snapshot.ps1

Write-Host ''
Write-Host 'Next steps (docs/brownfield.md):'
Write-Host '  1. /speckit-constitution — document REAL constraints (modules/integrations that must not break),'
Write-Host '     pick the persistence model (Living Spec recommended for brownfield) and record it.'
if ($WithAudit) { Write-Host '  2. /audit full — audit loops feed the constitution with evidence.' }
else            { Write-Host '  2. (optional) /audit full — evidence for the constitution.' }
Write-Host '     /audit consistency measures the gap to docs/padroes/ (handbook).'
Write-Host '  3. Normal pipeline per feature; /speckit-converge closes code<->spec drift each cycle.'
