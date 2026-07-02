# ONCC ERP Deployment Package

Dieses Paket enthaelt den aktuellen hellen ERP-Stand mit Haupt-Dashboard, Bereichs-Dashboards, PDM/ERP-Modulen und Sicherheitsuebersicht.

## Inhalt

- `osmechplast-management-erp/` - fertiger Web-App-Dateisatz
- `deploy_to_real_oncc_repo.ps1` - kopiert in das echte ONCC-GitHub-Projekt, committet und pusht

## Zielprojekt

`C:\Users\Director\Documents\Italien Firma\oncc ERP`

GitHub:

`https://github.com/zouiniabdelaziz-glitch/oncc-erp.git`

Cloudflare Pages:

`https://oncc-erp.pages.dev`

## Ausfuehren

PowerShell im Paketordner oeffnen und ausfuehren:

```powershell
.\deploy_to_real_oncc_repo.ps1
```

Danach sollte Cloudflare Pages automatisch neu deployen.

## Zugriffsschutz pruefen

Privates Browserfenster oeffnen:

- Firefox: `Strg + Shift + P`
- Chrome/Edge: `Strg + Shift + N`

Dann:

`https://oncc-erp.pages.dev`

Wenn zuerst Cloudflare Login kommt, funktioniert der Zugriffsschutz. Wenn direkt das ERP kommt, ist Cloudflare Access noch nicht korrekt mit einer Policy verbunden.
