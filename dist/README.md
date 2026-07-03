# OS.MECHPLAST Management ERP

Lokaler Prototyp für ein kleines, modulares ERP/MRP mit PDM-Kern für eine CNC-Lohnfertigung.

## Cloud- und Windows-App

Das ERP ist ab jetzt als Cloud-App gedacht:

- Cloudflare Pages liefert immer den aktuellen ERP-Code aus.
- GitHub bleibt der Code-Speicher; nach `git push` baut Cloudflare die neue Version.
- Die Windows-App ist nur der lokale Zugang zu `https://oncc-erp.pages.dev`.
- Normale ERP-Updates brauchen auf Abdelaziz' oder Mohammeds PC keine Neuinstallation.
- Der Installationsordner kann über Google Drive verteilt werden; die Rechte und Daten liegen später in Cloudflare, nicht im Drive-Ordner.

## Starten

`index.html` im Browser öffnen.

Die App speichert Daten aktuell lokal im Browser. Im Modul `Daten & Module` kann ein JSON-Backup exportiert und wieder importiert werden.

## Aktueller Stand

Die App ist jetzt als Modul-Landkarte aufgebaut:

- Start: Dashboard, Modul-Landkarte
- System & Rechte: Gesellschaft, Rollen, Historie, Nummernkreise, Daten & Module
- Management: Projekte, Aufgaben
- Vertrieb & CRM: Kunden, Kontakte, RFQs, Angebotsrechner, Angebote, Aufträge
- PDM / Konstruktion: Teile, Teilrevisionen, Dateien/Zeichnungen, Stückliste, Änderungen
- Einkauf: Lieferanten, Materialbedarf, Bestellungen, Wareneingang
- Lager: Lagerorte, Bestand, Bewegungen, Reservierungen
- Produktion / MRP: Kapazitätsentscheidung, Maschinen, Partnerbetriebe, Arbeitspläne, Arbeitsgänge, Maschinenkalender, Produktionsaufträge, Rückmeldungen
- Qualität: Prüfpläne, Erstteilfreigabe, Prüfprotokolle, Reklamationen
- Logistik: Lieferstatus mit Packliste, DAXA-Referenz und Tracking
- Personal: Mitarbeiter, Qualifikationen, Schichten, Abwesenheiten
- Finanzen: Kostenstellen, Rechnungen, Gutschriften, Zahlungen, offene Posten, Finanzbuchungen
- Stammdaten: Materialgruppen

## Verbindliche Ablaeufe

- Kunde -> RFQ -> Teilrevision -> Angebotsrechner -> Angebot -> Auftrag -> Produktionsauftrag -> Versand -> Rechnung -> Zahlung
- Teil -> Revision -> Stückliste -> Arbeitsplan -> Materialreservierung -> Einkauf oder Lagerentnahme
- Mitarbeiter + Qualifikation + Verfügbarkeit -> Schicht -> Arbeitsgang

Angebote und produktionsnahe Module verwenden freigegebene Teilrevisionen. Bekannte nicht freigegebene Revisionen werden beim Speichern aus dem Angebotsrechner blockiert.

## Historie

Speichern und Löschen erzeugt automatisch Historieneintraege mit Zeit, Benutzer, Modul, Datensatz und Aktion. Das ist der Start für Audit-Historie, Freigaben, Lagerbewegungen und spätere Finanzbuchungen.

## Bewusst noch nicht enthalten

- keine rechtsverbindliche italienische Buchhaltung
- keine FatturaPA/SDI-Logik ohne Commercialista-Prüfung
- kein großes Lager mit Chargen, Zeugnissen, Barcode oder Inventur
- keine Lohnabrechnung
- noch keine echte Dateiablage, nur Dateireferenzen
- noch keine zentrale Mehrbenutzer-Datenbank

## Nächster technischer Schritt

Wenn die Logik und Screens passen, wird diese App weiter zur echten Mehrbenutzer-Cloud-App ausgebaut:

- Cloudflare Access für Login und Schutz
- Cloudflare D1 als zentrale SQL-Datenbank
- Rollen- und Rechtesystem pro Benutzer
- Cloudflare R2 oder Google Drive für Zeichnungen und Dateien
- Windows-Installer bleibt als einfacher Zugang zur Cloud-App
