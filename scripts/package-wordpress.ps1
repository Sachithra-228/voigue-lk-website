# Builds the two installable WordPress zip files into wordpress/dist/.
# Zip entries are written with forward slashes so they unpack correctly on Linux hosts such as Bluehost.
# Usage: npm run wp:zip

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$wp   = Join-Path $root 'wordpress'
$dist = Join-Path $wp 'dist'

# Folders and files that are only used while developing.
$skip = @('src', 'node_modules', '.git', '.DS_Store', 'Thumbs.db')

function New-PackageZip([string]$folderName) {
    $source = Join-Path $wp $folderName
    $target = Join-Path $dist "$folderName.zip"
    if (Test-Path $target) { Remove-Item $target -Force }

    $zip = [System.IO.Compression.ZipFile]::Open($target, 'Create')
    try {
        $prefix = (Resolve-Path $source).Path.TrimEnd('\') + '\'
        Get-ChildItem -Path $source -Recurse -File -Force | ForEach-Object {
            $relative = $_.FullName.Substring($prefix.Length)
            $parts = $relative -split '\\'
            if ($parts | Where-Object { $skip -contains $_ }) { return }
            $entryName = "$folderName/" + ($parts -join '/')
            [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName, 'Optimal')
        }
    } finally {
        $zip.Dispose()
    }
    $size = [math]::Round((Get-Item $target).Length / 1KB)
    Write-Host ("{0}.zip  {1} KB" -f $folderName, $size)
}

New-Item -ItemType Directory -Force -Path $dist | Out-Null
New-PackageZip 'voigue-theme'
New-PackageZip 'voigue-core'
Write-Host "Done: $dist"
