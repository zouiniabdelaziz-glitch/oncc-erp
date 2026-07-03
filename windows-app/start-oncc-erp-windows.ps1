$ErrorActionPreference = "Stop"

$AppUrl = "https://oncc-erp.pages.dev"

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

$launchUrl = "$AppUrl/?desktop=windows&launch=$(Get-Date -Format 'yyyyMMddHHmmss')"
Start-Process -FilePath $browser -ArgumentList "--app=$launchUrl"
