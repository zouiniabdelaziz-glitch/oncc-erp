$ErrorActionPreference = "Stop"

$AppName = "ONCC ERP"
$ProfileDir = Join-Path $env:LOCALAPPDATA "ONCC ERP\BrowserProfile"

Write-Host ""
Write-Host "ONCC ERP Login wird zurueckgesetzt."
Write-Host "ERP-Daten in Cloudflare werden nicht geloescht."
Write-Host ""

if (Test-Path -LiteralPath $ProfileDir) {
  $resolvedProfile = (Resolve-Path -LiteralPath $ProfileDir).Path
  $allowedRoot = Join-Path $env:LOCALAPPDATA "ONCC ERP"
  $resolvedAllowedRoot = if (Test-Path -LiteralPath $allowedRoot) {
    (Resolve-Path -LiteralPath $allowedRoot).Path
  } else {
    $allowedRoot
  }

  if (!$resolvedProfile.StartsWith($resolvedAllowedRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Sicherheitsstopp: Das Profil liegt nicht im erwarteten ONCC ERP Ordner."
  }

  $browserProcesses = Get-Process msedge, chrome -ErrorAction SilentlyContinue
  if ($browserProcesses) {
    Write-Host "Bitte offene ONCC ERP Fenster schliessen. Browser wird nicht automatisch beendet."
    Write-Host "Danach diese Datei nochmal starten."
    exit 1
  }

  Remove-Item -LiteralPath $resolvedProfile -Recurse -Force
  Write-Host "Geloescht:"
  Write-Host $resolvedProfile
} else {
  Write-Host "Kein lokales ERP-Loginprofil gefunden."
}

Write-Host ""
Write-Host "Fertig. ONCC ERP jetzt neu oeffnen und mit der richtigen Cloudflare-E-Mail anmelden."
