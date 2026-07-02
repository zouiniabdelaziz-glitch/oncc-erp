# ONCC ERP Cloudflare D1 Setup

Ziel: Du pushst den ERP-Ordner zu GitHub. Cloudflare Pages erkennt die App und die `functions/api/*` automatisch. Nur die Datenbank selbst und die Bindung `ONCC_DB` müssen einmal in Cloudflare eingestellt werden.

## Was Git/Cloudflare automatisch erkennt

- `index.html`, `styles.css`, `js/*`: die ERP-Web-App.
- `functions/api/health.js`: API-Prüfung für den Cloud-Speicher.
- `functions/api/state.js`: API zum Laden und Speichern des zentralen ERP-Zustands.
- `schema.sql`: Referenz für die Datenbankstruktur.

## Was du in Cloudflare einmal einstellen musst

1. In Cloudflare eine D1-Datenbank anlegen:

```text
Name: oncc-erp
```

2. Im Cloudflare-Pages-Projekt `oncc-erp` eine D1-Bindung hinzufügen:

```text
Binding name: ONCC_DB
Database: oncc-erp
```

3. Danach den Ordner zu GitHub pushen. Cloudflare Pages deployt automatisch.

## Muss ich `wrangler d1 execute ...` eingeben?

Nein, nicht zwingend.

Die App-Funktionen legen die benötigten Tabellen beim ersten API-Aufruf selbst an, sobald `ONCC_DB` verbunden ist.

Der Befehl ist nur optional, wenn man die Tabellen bewusst vorab manuell erzeugen möchte:

```powershell
wrangler d1 execute oncc-erp --file=./schema.sql --remote
```

Für deinen gewünschten Ablauf reicht:

```text
Cloudflare D1 erstellen -> ONCC_DB Binding setzen -> Git push
```

## Erwartetes Verhalten

- D1 verbunden: Status zeigt `Cloud`.
- D1 fehlt oder lokale Vorschau: Status zeigt `Lokaler Fallback`.
- `Speichern` erzeugt weiterhin Speicher-Historie und Audit-Einträge.

## Nächster Ausbau

Diese Version speichert einen zentralen ERP-Snapshot. Für echte gleichzeitige Bearbeitung bauen wir später Tabellen pro Modul, Konflikterkennung und Benutzerrechte pro Rolle.
