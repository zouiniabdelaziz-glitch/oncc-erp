$ErrorActionPreference = "Stop"

$AppUrl = "https://oncc-erp.pages.dev"
$ProfileDir = Join-Path $env:LOCALAPPDATA "ONCC ERP\BrowserProfile"

$candidates = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
)

$browser = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (!$browser) {
  throw "Microsoft Edge oder Google Chrome wurde nicht gefunden."
}

if (!(Test-Path -LiteralPath $ProfileDir)) {
  New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null
}

$launchUrl = "$AppUrl/?desktop=windows&launch=$(Get-Date -Format 'yyyyMMddHHmmss')"
$arguments = @(
  "--user-data-dir=`"$ProfileDir`"",
  "--profile-directory=Default",
  "--app=`"$launchUrl`""
)
Start-Process -FilePath $browser -ArgumentList $arguments
