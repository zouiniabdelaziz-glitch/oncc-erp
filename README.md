# OS.MECHPLAST Management ERP

Erster lokaler Prototyp fuer ein kleines, modulares Management-ERP/MRP.

## Starten

`index.html` im Browser oeffnen.

Die App speichert Daten lokal im Browser. Im Modul `Daten & Module` kann ein JSON-Backup exportiert und wieder importiert werden.

## V1-Module

- Dashboard
- Projekte
- Aufgaben
- Kunden
- Kontakte
- RFQs / Anfragen
- Dateien / Zeichnungen
- Angebote
- Angebotsrechner
- Auftraege
- Lieferstatus
- Kapazitaetsentscheidung
- Maschinen
- Materialgruppen
- Partnerbetriebe
- Daten & Module

## Aktueller Kernablauf

RFQ / Anfrage -> Angebotsrechner -> Angebot

Eine RFQ kann ueber `Rechnen` in den Angebotsrechner uebernommen werden. Der Rechner uebernimmt Kunde, Teiltyp, Material, Menge und Termin, berechnet Risiko, Lieferzeit, Angebotspreis und Stueckpreis und kann daraus ein Angebot speichern.

## Naechster technischer Schritt

Wenn die Logik und Screens passen, wird diese App in eine Desktop-Struktur ueberfuehrt:

- Tauri als Windows-App
- SQLite statt Browser-Speicher
- echter lokaler Dateiordner fuer Zeichnungen
- spaeter `.exe` / Installer
