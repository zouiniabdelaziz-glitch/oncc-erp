$ErrorActionPreference = "Stop"

$AppName = "ONCC ERP"
$AppUrl = "https://oncc-erp.pages.dev"
$LaunchUrl = "$AppUrl/?desktop=windows"
$Description = "ONCC ERP / OS.MECHPLAST Workspace"
$IconPath = Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")).Path "assets\icons\osmp-app-icon.ico"
$ProfileDir = Join-Path $env:LOCALAPPDATA "ONCC ERP\BrowserProfile"

function Find-Browser {
  $candidates = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  throw "Microsoft Edge oder Google Chrome wurde nicht gefunden."
}

function New-AppShortcut {
  param(
    [Parameter(Mandatory = $true)][string]$ShortcutPath,
    [Parameter(Mandatory = $true)][string]$BrowserPath
  )

  $directory = Split-Path -Parent $ShortcutPath
  if (!(Test-Path -LiteralPath $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($ShortcutPath)
  $shortcut.TargetPath = $BrowserPath
  $shortcut.Arguments = "--user-data-dir=`"$ProfileDir`" --profile-directory=Default --app=`"$LaunchUrl`""
  $shortcut.WorkingDirectory = Split-Path -Parent $BrowserPath
  $shortcut.IconLocation = if (Test-Path -LiteralPath $IconPath) { "$IconPath,0" } else { "$BrowserPath,0" }
  $shortcut.Description = $Description
  $shortcut.Save()
}

$browser = Find-Browser
if (!(Test-Path -LiteralPath $ProfileDir)) {
  New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null
}

$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "$AppName.lnk"
$startMenuShortcut = Join-Path ([Environment]::GetFolderPath("StartMenu")) "Programs\$AppName.lnk"

New-AppShortcut -ShortcutPath $desktopShortcut -BrowserPath $browser
New-AppShortcut -ShortcutPath $startMenuShortcut -BrowserPath $browser

Write-Host ""
Write-Host "ONCC ERP wurde als Windows-App installiert."
Write-Host ""
Write-Host "Desktop:"
Write-Host $desktopShortcut
Write-Host ""
Write-Host "Startmenue:"
Write-Host $startMenuShortcut
Write-Host ""
Write-Host "Eigenes App-Profil:"
Write-Host $ProfileDir
Write-Host ""
Write-Host "App-Adresse:"
Write-Host $AppUrl
Write-Host ""
Write-Host "Update-Modus: Cloudflare Pages. Normale ERP-Updates brauchen keine Neuinstallation."
Write-Host "Wichtig: Die Daten liegen zentral in Cloudflare. Google Drive bleibt für Dateien/Backups."
