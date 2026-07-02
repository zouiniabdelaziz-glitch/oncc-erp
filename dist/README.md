# OS.MECHPLAST Management ERP

Lokaler Prototyp für ein kleines, modulares ERP/MRP mit PDM-Kern für eine CNC-Lohnfertigung.

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

Wenn die Logik und Screens passen, wird diese App in eine Desktop-Struktur überführt:

- Tauri als Windows-App
- SQLite statt Browser-Speicher
- echter lokaler Dateiordner für Zeichnungen
- später `.exe` / Installer
