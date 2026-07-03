$ErrorActionPreference = "Stop"

$AppName = "ONCC ERP"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "$AppName.lnk"
$startMenuShortcut = Join-Path ([Environment]::GetFolderPath("StartMenu")) "Programs\$AppName.lnk"

foreach ($shortcut in @($desktopShortcut, $startMenuShortcut)) {
  if (Test-Path -LiteralPath $shortcut) {
    Remove-Item -LiteralPath $shortcut -Force
    Write-Host "Entfernt: $shortcut"
  }
}

Write-Host ""
Write-Host "ONCC ERP Windows-App-Verknuepfungen wurden entfernt."
Write-Host "Die Cloudflare-Daten wurden nicht geloescht."
