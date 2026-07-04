# ONCC ERP als Windows-App

Diese Windows-App ist eine installierte App-Verknüpfung auf die Cloudflare-Version:

`https://oncc-erp.pages.dev`

Sie öffnet das ERP in einem eigenen Fenster über Microsoft Edge oder Google Chrome.
Die Verknüpfung nutzt das OSMP-App-Icon, nicht das Browser-Icon.

## Updates

Die Windows-App ist nur der Zugang. Der aktuelle ERP-Code kommt aus Cloudflare Pages.

Wenn Abdelaziz neuen Code zu GitHub/Cloudflare veröffentlicht, sieht Mohammed beim nächsten Start automatisch die neue Version. Für normale ERP-Updates muss die Windows-App nicht neu installiert werden.

## Installieren

Im Projektordner ausführen:

```powershell
.\INSTALL_ONCC_ERP_WINDOWS.cmd
```

Danach gibt es:

- Desktop-Verknüpfung `ONCC ERP`
- Startmenü-Eintrag `ONCC ERP`

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

## Nächster Schritt zur echten EXE

Wenn später eine vollständig paketierte `.exe` gebraucht wird, bauen wir auf dieser Struktur eine Electron- oder Tauri-App. Dafür müssen dann einmal die Windows-Build-Abhängigkeiten installiert werden.
