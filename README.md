# OS.MECHPLAST Management ERP

Lokaler Prototyp fuer ein kleines, modulares ERP/MRP mit PDM-Kern fuer eine CNC-Lohnfertigung.

## Starten

`index.html` im Browser oeffnen.

Die App speichert Daten aktuell lokal im Browser. Im Modul `Daten & Module` kann ein JSON-Backup exportiert und wieder importiert werden.

## Aktueller Stand

Die App ist jetzt als Modul-Landkarte aufgebaut:

- Start: Dashboard, Modul-Landkarte
- System & Rechte: Gesellschaft, Rollen, Historie, Nummernkreise, Daten & Module
- Management: Projekte, Aufgaben
- Vertrieb & CRM: Kunden, Kontakte, RFQs, Angebotsrechner, Angebote, Auftraege
- PDM / Konstruktion: Teile, Teilrevisionen, Dateien/Zeichnungen, Stueckliste, Aenderungen
- Einkauf: Lieferanten, Materialbedarf, Bestellungen, Wareneingang
- Lager: Lagerorte, Bestand, Bewegungen, Reservierungen
- Produktion / MRP: Kapazitaetsentscheidung, Maschinen, Partnerbetriebe, Arbeitsplaene, Arbeitsgaenge, Maschinenkalender, Produktionsauftraege, Rueckmeldungen
- Qualitaet: Pruefplaene, Erstteilfreigabe, Pruefprotokolle, Reklamationen
- Logistik: Lieferstatus mit Packliste, DAXA-Referenz und Tracking
- Personal: Mitarbeiter, Qualifikationen, Schichten, Abwesenheiten
- Finanzen: Kostenstellen, Rechnungen, Gutschriften, Zahlungen, offene Posten, Finanzbuchungen
- Stammdaten: Materialgruppen

## Verbindliche Ablaeufe

- Kunde -> RFQ -> Teilrevision -> Angebotsrechner -> Angebot -> Auftrag -> Produktionsauftrag -> Versand -> Rechnung -> Zahlung
- Teil -> Revision -> Stueckliste -> Arbeitsplan -> Materialreservierung -> Einkauf oder Lagerentnahme
- Mitarbeiter + Qualifikation + Verfuegbarkeit -> Schicht -> Arbeitsgang

Angebote und produktionsnahe Module verwenden freigegebene Teilrevisionen. Bekannte nicht freigegebene Revisionen werden beim Speichern aus dem Angebotsrechner blockiert.

## Historie

Speichern und Loeschen erzeugt automatisch Historieneintraege mit Zeit, Benutzer, Modul, Datensatz und Aktion. Das ist der Start fuer Audit-Historie, Freigaben, Lagerbewegungen und spaetere Finanzbuchungen.

## Bewusst noch nicht enthalten

- keine rechtsverbindliche italienische Buchhaltung
- keine FatturaPA/SDI-Logik ohne Commercialista-Pruefung
- kein grosses Lager mit Chargen, Zeugnissen, Barcode oder Inventur
- keine Lohnabrechnung
- noch keine echte Dateiablage, nur Dateireferenzen
- noch keine zentrale Mehrbenutzer-Datenbank

## Naechster technischer Schritt

Wenn die Logik und Screens passen, wird diese App in eine Desktop-Struktur ueberfuehrt:

- Tauri als Windows-App
- SQLite statt Browser-Speicher
- echter lokaler Dateiordner fuer Zeichnungen
- spaeter `.exe` / Installer
