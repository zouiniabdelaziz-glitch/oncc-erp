$ErrorActionPreference = "Stop"

$Source = Join-Path $PSScriptRoot "osmechplast-management-erp"
$Target = "C:\Users\Director\Documents\Italien Firma\oncc ERP"
$CommitMessage = "Update ERP dashboard and module structure"

if (!(Test-Path -LiteralPath $Source)) {
  throw "Source package not found: $Source"
}

if (!(Test-Path -LiteralPath $Target)) {
  throw "Target repository not found: $Target"
}

Write-Host "Copying ERP files into real ONCC repo..."
Get-ChildItem -Path $Source -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring((Resolve-Path $Source).Path.Length).TrimStart("\")
  $destination = Join-Path $Target $relative
  $destinationDir = Split-Path -Parent $destination
  if (!(Test-Path -LiteralPath $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  }
  Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
}

Write-Host "Checking git status..."
$status = & git -c "safe.directory=$Target" -C $Target status --short
if (!$status) {
  Write-Host "No changes detected. Nothing to commit."
  exit 0
}

Write-Host $status
Write-Host "Creating commit..."
& git -c "safe.directory=$Target" -C $Target add .
& git -c "safe.directory=$Target" -C $Target commit -m $CommitMessage

Write-Host "Pushing to GitHub..."
& git -c "safe.directory=$Target" -C $Target push origin master

Write-Host "Done. Cloudflare Pages should deploy automatically:"
Write-Host "https://oncc-erp.pages.dev"
