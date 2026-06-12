#!/usr/bin/env pwsh
# Windows PowerShell (5.1+) / PowerShell Core (7+) script
# Usage:
#   pwsh generate.ps1 -a
#   pwsh generate.ps1 -m "霸王茶姬" "瑞幸"
#   powershell -File generate.ps1 -a

param(
    [switch]$a,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$m
)

$ErrorActionPreference = 'Stop'
$RAW_DIR = Join-Path $PSScriptRoot '..\..' | Join-Path -ChildPath 'raw' | Resolve-Path

$LOCAL_SNAPSHOT_RE = '\[本地快照\]\(http://localhost:7026/reading/(\d+)\)'
$SOURCE_URL_RE     = '\[原文地址\]\((https?://[^)]+)\)'

# ── Helpers ──────────────────────────────────────────────────────────────────

function Get-SortedMdFiles([string]$dir) {
    $files = Get-ChildItem -Path $dir -Filter '*.md' -File
    $nums  = @()
    $other = @()

    foreach ($f in $files) {
        $stem = $f.BaseName
        if ($stem -match '^\d+$' -and "$stem.md" -eq $f.Name) {
            $nums += [int]$stem
        } else {
            $other += $f.Name
        }
    }

    $nums  = $nums  | Sort-Object
    $other = $other | Sort-Object

    foreach ($n in $nums)  { "$n" }
    foreach ($o in $other) { $o -replace '\.md$', '' }
}

function Extract-SnapshotIds([string]$content) {
    [regex]::Matches($content, $LOCAL_SNAPSHOT_RE) |
        ForEach-Object { [int]$_.Groups[1].Value } |
        Sort-Object -Unique |
        ForEach-Object { "$_" }
}

function Extract-SourceUrls([string]$content) {
    $seen = [System.Collections.Generic.HashSet[string]]::new()
    [regex]::Matches($content, $SOURCE_URL_RE) |
        ForEach-Object { $_.Groups[1].Value } |
        Where-Object { $seen.Add($_) }
}

# ── Per-directory processing ────────────────────────────────────────────────

function Generate-ForDir([string]$dirPath, [string]$dirName) {
    $stems = @(Get-SortedMdFiles $dirPath)
    if ($stems.Count -eq 0) { return $false }

    $lines = [System.Collections.ArrayList]::new()

    foreach ($stem in $stems) {
        $file = Join-Path $dirPath "$stem.md"
        if (-not (Test-Path $file)) { continue }

        $content = Get-Content -Path $file -Raw -Encoding UTF8

        $ids = @(Extract-SnapshotIds $content)
        if ($ids.Count -gt 0) {
            [void]$lines.Add("@${stem}: $($ids -join ', ')")
        } else {
            $urls = @(Extract-SourceUrls $content)
            if ($urls.Count -gt 0) {
                [void]$lines.Add("@${stem}: $($urls -join ', ')")
            }
        }
    }

    if ($lines.Count -eq 0) { return $false }

    $outPath = Join-Path $dirPath 'index_map.txt'
    # Ensure trailing newline
    [System.IO.File]::WriteAllText($outPath, ($lines -join "`n") + "`n", [System.Text.Encoding]::UTF8)
    Write-Host "[ok]   $dirName → index_map.txt"
    return $true
}

# ── Main ─────────────────────────────────────────────────────────────────────

if (-not $a -and ($null -eq $m -or $m.Count -eq 0)) {
    Write-Host 'Usage: generate.ps1 -a | -m <dir> [dir ...]' -ForegroundColor Yellow
    exit 1
}

if ($a) {
    $dirs = Get-ChildItem -Path $RAW_DIR -Directory
} else {
    $dirs = $m | ForEach-Object {
        $p = Join-Path $RAW_DIR $_
        if (Test-Path $p -PathType Container) {
            Get-Item $p
        } else {
            Write-Host "[skip] $_: not a directory" -ForegroundColor Yellow
            $null
        }
    } | Where-Object { $null -ne $_ }
}

foreach ($d in $dirs) {
    if (-not (Generate-ForDir $d.FullName $d.Name)) {
        Write-Host "[skip] $($d.Name): no .md files with sources" -ForegroundColor Yellow
    }
}
