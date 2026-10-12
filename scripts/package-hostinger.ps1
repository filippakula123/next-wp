param([string]$OutputName = 'luzik-hostinger-v3.zip', [switch]$ValidateOnly)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if ([IO.Path]::GetFileName($OutputName) -ne $OutputName -or -not $OutputName.EndsWith('.zip')) {
    throw 'OutputName must be a ZIP filename without directories.'
}
$outputDirectory = Join-Path $projectRoot 'deployment'
$archivePath = Join-Path $outputDirectory $OutputName
if (Test-Path -LiteralPath $archivePath) { throw "Archive already exists: $archivePath" }

# Ship runtime sources and required build configuration only.
# Filter deleted Git entries; exclude tooling, tests, private env and generated caches.
$sourceFiles = @(git -C $projectRoot ls-files --cached --others --exclude-standard | Where-Object {
    $_ -match '^(app|components|lib|public)/' -or
    $_ -in @('package.json','pnpm-lock.yaml','pnpm-workspace.yaml','next.config.ts','tsconfig.json','postcss.config.js','site.config.ts','.env.example','LICENSE')
} | Where-Object {
    Test-Path -LiteralPath (Join-Path $projectRoot $_) -PathType Leaf
} | Sort-Object -Unique)
if ($LASTEXITCODE -ne 0) { throw 'Unable to list project files.' }
foreach ($requiredFile in @('package.json', 'site.config.ts', 'next.config.ts', 'tsconfig.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'lib/luzik-privacy.html')) {
    if ($requiredFile -notin $sourceFiles) { throw "Required file missing: $requiredFile" }
}
if ($ValidateOnly) {
    Write-Output "Verified deployment file list: $($sourceFiles.Count) files. No archive created."
    return
}
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

Add-Type -AssemblyName System.IO.Compression
$archive = [IO.Compression.ZipFile]::Open($archivePath, [IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($sourceFile in $sourceFiles) {
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive, (Join-Path $projectRoot $sourceFile), $sourceFile.Replace('\', '/'),
            [IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
} finally { $archive.Dispose() }

$verificationArchive = [IO.Compression.ZipFile]::OpenRead($archivePath)
try {
    $entryNames = @($verificationArchive.Entries.FullName)
    if (@(Compare-Object $sourceFiles $entryNames).Count -ne 0) { throw 'Archive contents differ from source files.' }
    if ($entryNames | Where-Object { $_ -match '(^|/)(node_modules|\.git|\.next|deployment)(/|$)|(^|/)\.env(\.|$)' -and $_ -ne '.env.example' }) {
        throw 'Archive contains excluded files.'
    }
    Write-Output "Verified archive: $archivePath ($($entryNames.Count) files)"
} finally { $verificationArchive.Dispose() }
