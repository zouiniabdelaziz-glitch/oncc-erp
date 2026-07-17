# ONCC ERP als Windows-App

Diese Windows-App ist eine installierte App-Verknüpfung auf die Cloudflare-Version:

`https://oncc-erp.pages.dev`

Sie öffnet das ERP in einem eigenen Fenster über Microsoft Edge oder Google Chrome.
Die Verknüpfung nutzt ein eigenes Browserprofil:

`%LOCALAPPDATA%\ONCC ERP\BrowserProfile`

Damit wird die ERP-Anmeldung nicht mehr mit dem normalen Edge-/Chrome-Konto gemischt.

## Wichtig bei Abdelaziz und Mohammed

Jeder Benutzer meldet sich über Cloudflare Access mit seiner eigenen E-Mail an.

- Abdelaziz-Mail zeigt Abdelaziz Dashboard.
- Mohammed-Mail zeigt Mohammed Dashboard.
- Falsche oder unbekannte Mail zeigt `Login nicht verbunden`.

Wenn oben im ERP die falsche E-Mail steht, im ERP auf `Konto wechseln` klicken und danach mit der richtigen Cloudflare-E-Mail anmelden.

## Einmalige Korrektur der bestehenden Verknüpfung

Wenn die App schon vorher installiert war, einmal ausführen:

```powershell
.\INSTALL_ONCC_ERP_WINDOWS.cmd
```

Das ist keine neue ERP-Installation. Es aktualisiert nur die Windows-Verknüpfung auf das eigene ERP-Browserprofil.

## Updates

Die Windows-App ist nur der Zugang. Der aktuelle ERP-Code kommt aus Cloudflare Pages.

Wenn neuer Code zu GitHub/Cloudflare veröffentlicht wird, sieht Mohammed beim nächsten Start oder nach `Update prüfen` die neue Version. Für normale ERP-Updates muss die Windows-App nicht neu installiert werden.

## Direkt starten

```powershell
.\START_ONCC_ERP_WINDOWS.cmd
```

## Deinstallieren

```powershell
.\UNINSTALL_ONCC_ERP_WINDOWS.cmd
```

## Speicher

Die ERP-Daten sollen zentral über Cloudflare laufen.

Google Drive ist sinnvoll für:

- Zeichnungen
- STEP-Dateien
- PDFs
- Excel-Importe
- Backups

Google Drive ist nicht die Hauptdatenbank.
