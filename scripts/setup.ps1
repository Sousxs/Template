#!/usr/bin/env pwsh
# One-time machine/repo setup (Windows-first). Installs the FULL toolchain by default:
# repomix, ccusage, OCR (open-code-review), code-review-graph (AST graph + MCP),
# ponytail (minimal-code discipline), Spec Kit upgrade.
# Safe to re-run. Use -Skip* flags only in constrained environments.
[CmdletBinding()]
param(
    [switch]$SkipOCR,
    [switch]$SkipCRG,            # skip code-review-graph
    [switch]$SkipSpecKitUpgrade  # skip specify self upgrade (commit first when upgrading!)
)
$ErrorActionPreference = 'Stop'

Write-Host '== Template setup =='

# Prerequisites
$gitV = (git --version) -replace '[^\d.]', ''
Write-Host "git $gitV (need >= 2.41)"
try { $nodeV = node --version; Write-Host "node $nodeV (need >= 18)" }
catch { Write-Error 'Node.js not found — required (repomix, ccusage, OCR). Install Node 18+ and re-run.' }

# Windows long paths (deep trees exceed MAX_PATH)
git config core.longpaths true
Write-Host 'git core.longpaths = true'

# Warm the npx cache so first agent use is fast
Write-Host 'Priming repomix + ccusage...'
npx -y repomix --version | Out-Null
npx -y ccusage@latest --version 2>$null | Out-Null

if (-not $SkipOCR) {
    Write-Host 'Installing open-code-review CLI (review stage + brownfield scan)...'
    npm install -g "@alibaba-group/open-code-review"
    ocr --version
}

if (-not $SkipCRG) {
    Write-Host 'Installing code-review-graph (AST knowledge graph + MCP + blast radius)...'
    $py = Get-Command python -ErrorAction SilentlyContinue
    if (-not $py) { Write-Error 'Python 3.10+ not found — required by code-review-graph. Install it and re-run.' }
    if (Get-Command pipx -ErrorAction SilentlyContinue) { pipx install code-review-graph --force }
    else { pip install --upgrade code-review-graph }
    # Auto-configure every detected agent (Claude Code, Cursor, opencode, Antigravity...)
    code-review-graph install
    # Build the graph for THIS repo (incremental afterwards: code-review-graph update)
    code-review-graph build
}

# Ponytail — minimal-code discipline plugin (binding ladder lives in CLAUDE.md/AGENTS.md;
# the plugin adds /ponytail-review, /ponytail-audit and lifecycle enforcement)
if (Get-Command claude -ErrorAction SilentlyContinue) {
    Write-Host 'Installing ponytail plugin for Claude Code...'
    claude plugin marketplace add DietrichGebert/ponytail 2>$null
    claude plugin install ponytail@ponytail 2>$null
}
Write-Host 'Ponytail on other agents: Cursor/Windsurf rule file, opencode skill — see github.com/dietrichgebert/ponytail'

if (-not $SkipSpecKitUpgrade) {
    if (Get-Command specify -ErrorAction SilentlyContinue) {
        $dirty = git status --porcelain
        if ($dirty) {
            Write-Warning 'Working tree not clean — commit first, then re-run for the Spec Kit upgrade.'
        } else {
            Write-Host 'Upgrading Spec Kit (brings /speckit-converge, workflow gates, bug extension)...'
            specify self upgrade
            specify integration upgrade claude
            specify integration upgrade agy
            specify extension update
            $ext = Get-Content .specify/extensions.yml -Raw -ErrorAction SilentlyContinue
            if ($ext -notmatch '(?m)^\s*-\s*git\s*$') {
                Write-Host 're-adding git extension (opt-in since 0.10.0)...'
                specify extension add git
            }
            specify extension add bug 2>$null
        }
    } else {
        Write-Warning "specify CLI not found — install it (https://github.com/github/spec-kit) and re-run; /speckit-converge depends on it."
    }
}

Write-Host ''
Write-Host '== CI secrets checklist (names only — set values in GitHub repo settings) =='
Write-Host '  CLAUDE_CODE_OAUTH_TOKEN   (run: claude setup-token)  OR  ANTHROPIC_API_KEY'
Write-Host '  OCR_LLM_URL / OCR_LLM_AUTH_TOKEN + vars OCR_LLM_MODEL, OCR_LLM_USE_ANTHROPIC (ocr-review.yml)'
Write-Host '  crg-review.yml uses the built-in GITHUB_TOKEN — nothing to configure'
Write-Host 'GitHub app for @claude workflows: run  claude /install-github-app'
Write-Host ''
Write-Host 'Next: fill PROJECT-COMMANDS.md, then /speckit-constitution (greenfield) or scripts/onboard-brownfield.ps1.'
