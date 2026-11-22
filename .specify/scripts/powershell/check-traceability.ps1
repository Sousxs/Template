#!/usr/bin/env pwsh
# Deterministic traceability gate (GATE B + CI). Zero-token enforcement of:
#   branch NNN-name · zero [NEEDS CLARIFICATION] · AC->test-task mapping ·
#   commit<->T-ID traceability · naive secret scan on versioned artifacts.
# Exit 0 = pass, 1 = failures (each printed as "FAIL: ...").
[CmdletBinding()]
param(
    [string]$BaseBranch = 'main',
    [switch]$SkipCommits    # spec-only checks (before any implementation commit exists)
)
$ErrorActionPreference = 'Stop'
$script:failures = @()
function Fail([string]$msg) { $script:failures += $msg; Write-Host "FAIL: $msg" }
function Pass([string]$msg) { Write-Host "ok:   $msg" }

# --- 1. Branch name -----------------------------------------------------------
# CI: pull_request checkouts are detached (refs/pull/N/merge) — use GITHUB_HEAD_REF there.
$branch = if ($env:GITHUB_HEAD_REF) { $env:GITHUB_HEAD_REF } else { (git rev-parse --abbrev-ref HEAD).Trim() }
if ($branch -match '^\d{3}-[a-z0-9-]+$') { Pass "branch '$branch' matches NNN-name" }
elseif ($branch -in @('main', 'master')) { Write-Host "note: on '$branch' — branch/commit checks limited" }
else { Fail "branch '$branch' does not match NNN-feature-name" }

# --- 2. Feature directory -----------------------------------------------------
$featureDir = $null
if (Test-Path 'specs') {
    if ($branch -match '^\d{3}-') {
        $featureDir = Get-ChildItem 'specs' -Directory | Where-Object Name -eq $branch | Select-Object -First 1
        if (-not $featureDir) { Fail "specs/$branch not found for branch '$branch'" }
    }
    if (-not $featureDir) {
        $featureDir = Get-ChildItem 'specs' -Directory | Where-Object Name -match '^\d{3}-' |
            Sort-Object Name -Descending | Select-Object -First 1
    }
}
if (-not $featureDir) {
    Fail 'no specs/NNN-* directory found'
} else {
    Write-Host "feature: $($featureDir.Name)"
    $specPath  = Join-Path $featureDir.FullName 'spec.md'
    $tasksPath = Join-Path $featureDir.FullName 'tasks.md'

    # --- 3. [NEEDS CLARIFICATION] ---------------------------------------------
    if (Test-Path $specPath) {
        $clar = (Select-String -Path $specPath -Pattern '\[NEEDS CLARIFICATION' -AllMatches).Matches.Count
        if ($clar -gt 0) { Fail "spec.md contains $clar [NEEDS CLARIFICATION] marker(s)" }
        else { Pass 'spec.md: zero [NEEDS CLARIFICATION]' }
    } else { Fail "spec.md missing in specs/$($featureDir.Name)" }

    # --- 4. AC -> test-task mapping -------------------------------------------
    if ((Test-Path $specPath) -and (Test-Path $tasksPath)) {
        $specText  = Get-Content $specPath -Raw
        $tasksText = Get-Content $tasksPath -Raw
        $acIds = [regex]::Matches($specText, 'AC-\d{3}') | ForEach-Object Value | Sort-Object -Unique
        if ($acIds.Count -eq 0) {
            Fail 'spec.md defines no stable AC-IDs (AC-001...) — mechanical traceability impossible'
        } else {
            $orphans = @($acIds | Where-Object { $tasksText -notmatch [regex]::Escape($_) })
            if ($orphans.Count -gt 0) { $orphans | ForEach-Object { Fail "$_ has no task referencing it in tasks.md" } }
            else { Pass "all $($acIds.Count) AC-IDs are referenced in tasks.md" }
        }
    } elseif (-not (Test-Path $tasksPath)) { Write-Host 'note: tasks.md not present yet — AC mapping skipped' }

    # --- 5. Commit <-> work-ID traceability ------------------------------------
    if (-not $SkipCommits -and $branch -match '^\d{3}-') {
        $range = "$BaseBranch..HEAD"
        $log = git log --no-merges --format='%h%x09%s' $range 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Host "note: cannot resolve $range — commit checks skipped" }
        elseif (-not $log) { Write-Host 'note: no commits on the feature branch yet' }
        else {
            $idPattern = 'T\d{3}|\[(BUG|SEC|DEDUP|PERF|REF|TEST|CONS|UX|DEPS|DOCS)-\d+\]|\[Q\d+\]'
            $tasksText = if (Test-Path $tasksPath) { Get-Content $tasksPath -Raw } else { '' }
            $bad = 0
            foreach ($line in @($log)) {
                $hash, $subject = $line -split "`t", 2
                if ($subject -like '`[Spec Kit`]*') { continue }   # spec-kit git-extension auto-commits are exempt
                if ($subject -notmatch $idPattern) { Fail "commit $hash has no work ID: '$subject'"; $bad++ }
                else {
                    foreach ($t in ([regex]::Matches($subject, 'T\d{3}') | ForEach-Object Value)) {
                        if ($tasksText -and $tasksText -notmatch [regex]::Escape($t)) {
                            Fail "commit $hash references $t which does not exist in tasks.md"; $bad++
                        }
                    }
                }
            }
            if ($bad -eq 0) { Pass 'all commits reference valid work IDs' }
        }
    }
}

# --- 6. Naive secret scan on versioned artifacts -------------------------------
$scanRoots = @('specs', '.specify/memory') | Where-Object { Test-Path $_ }
$secretPatterns = @(
    '(?i)(password|passwd|pwd)\s*[:=]\s*["'']?[^\s"''$<{][^\s"'']*',
    '(?i)(api[_-]?key|secret|token)\s*[:=]\s*["'']?[A-Za-z0-9_\-/+]{12,}',
    '-----BEGIN (RSA|EC|OPENSSH|DSA)? ?PRIVATE KEY',
    '(?i)AccountKey=[A-Za-z0-9+/=]{20,}',
    'sk-[A-Za-z0-9]{20,}',
    'ghp_[A-Za-z0-9]{20,}',
    'eyJ[A-Za-z0-9_-]{20,}\.eyJ'
)
$hits = 0
foreach ($root in $scanRoots) {
    $files = Get-ChildItem $root -Recurse -File -Include '*.md','*.json','*.yml','*.yaml' -ErrorAction SilentlyContinue
    foreach ($f in $files) {
        foreach ($p in $secretPatterns) {
            $m = Select-String -Path $f.FullName -Pattern $p -AllMatches -ErrorAction SilentlyContinue
            if ($m) { Fail "possible secret in $($f.FullName -replace [regex]::Escape($PWD.Path + '\'), ''): pattern '$p'"; $hits++ }
        }
    }
}
if ($hits -eq 0 -and $scanRoots.Count -gt 0) { Pass 'no naive secret patterns in specs/ or .specify/memory/' }

# --- Summary -------------------------------------------------------------------
Write-Host ''
if ($script:failures.Count -gt 0) {
    Write-Host "TRACEABILITY GATE: FAIL ($($script:failures.Count) issue(s))"
    exit 1
}
Write-Host 'TRACEABILITY GATE: PASS'
exit 0
