# OS.MECHPLAST Management ERP - Modulstruktur

Ziel: klein starten, aber fachlich richtig schneiden. Jedes Thema bleibt ein eigenes Modul. Wenn ein Modul zu groß wird, wird es in kleinere Module geteilt.

## Grundprinzip

- ERP verwaltet Geschäftsvorgaenge: Kunde, RFQ, Angebot, Auftrag, Einkauf, Lager, Produktion, Versand, Rechnung, Zahlung.
- PDM ist die verbindliche Quelle für Teil, Zeichnung, STEP, Revision, Freigabe, Stückliste und Änderung.
- MRP verbindet Bedarf, Bestand, Reservierung, Einkauf, Maschine, Mitarbeiter, Qualifikation und Kapazität.
- Finanzen bleibt am Anfang Management- und Rechnungsgrundlage, nicht rechtsverbindliche Buchhaltung.

## Verbindliche Ablaeufe

- Kunde -> RFQ -> Teilrevision -> Angebotsrechner -> Angebot -> Auftrag -> Produktionsauftrag -> Versand -> Rechnung -> Zahlung
- Teil -> Revision -> Stückliste -> Arbeitsplan -> Materialreservierung -> Einkauf oder Lagerentnahme
- Mitarbeiter + Qualifikation + Verfügbarkeit -> Schicht -> Arbeitsgang

Nur freigegebene Teilrevisionen sollen in Angebot, Auftrag und Produktion verwendet werden. Der Angebotsrechner blockiert bekannte nicht freigegebene Revisionen beim Speichern eines Angebots.

## Start

- Dashboard
  - Aufgaben, Projekte, RFQs, Aufträge
  - Materialbedarf, Reservierungen, Fertigungsaufträge
  - PDM-Freigaben und Finanz-Sperren
- Modul-Landkarte
  - Bereiche jetzt/später
  - Ausbauphasen
  - verbindliche Workflows

## System & Rechte

- Gesellschaft
  - OS.MECHPLAST SRLS als Startmandant
- Rollen
  - Admin, Vertrieb, Produktion, Finanzen gesperrt
- Historie
  - Zeitstempel
  - Benutzer
  - Modul und Datensatz
  - Aktion und Zusammenfassung
- Nummernkreise
  - RFQ
  - Angebot
  - Rechnung gesperrt bis Finanzvalidierung
- Daten & Module
  - Backup exportieren
  - Backup importieren
  - Demo-Daten wiederherstellen
  - Modulübersicht

Später:

- echte Benutzer
- Rollenrechte pro Modul
- SQLite-Backup
- Cloud-Sync optional
- Tauri-.exe-Build

## Management

- Projekte
  - interne Projekte
  - Kundenprojekte
  - Prozessverbesserungen
  - ERP-Ausbau
- Aufgaben
  - Verantwortliche
  - Fälligkeit
  - Prioritaet
  - Status

Später:

- Wochenplanung
- wiederkehrende Aufgaben
- Monatsreport
- Plan/Ist-Auswertung

## Vertrieb & CRM

- Kunden
  - Firma
  - Land
  - Branche
  - Status
- Kontakte
  - Ansprechpartner
  - Rolle
  - Sprache
  - Kontaktstatus
- RFQs / Anfragen
  - Kunde
  - Kontakt
  - PDM-Teil
  - Teilrevision
  - Materialgruppe
  - Stückzahl
  - Terminwunsch
  - Komplexitaet
  - Toleranz
- Angebotsrechner
  - Maschinenfit
  - Maschinenkalender
  - Kapazitätspruefung
  - Preisabschaetzung
  - Risiko und Entscheidung
- Angebote
  - RFQ
  - PDM-Teil
  - freigegebene Revision
  - Lieferzeit
  - Preisstatus
  - Risiko
  - Entscheidung
- Aufträge
  - Angebotsbezug
  - PDM-Teil
  - freigegebene Revision
  - Menge
  - Termin
  - Status

Später:

- Follow-ups
- Angebots-PDF
- Angebotspositionen
- Wiederholangebote
- Aktivitaeten / Kontaktverlauf

## PDM / Konstruktion

- Teile
  - Teilenummer
  - Bezeichnung
  - Kunde
  - Teiletyp
  - aktuelle Revision
- Teilrevisionen
  - Revision
  - Status
  - Zeichnung / PDF
  - STEP / 3D
  - Freigabedatum
  - Freigegeben von
- Dateien / Zeichnungen
  - Dateityp
  - Pfad/Name
  - PDM-Teil
  - Teilrevision
  - Referenz zu RFQ, Angebot, Auftrag, Projekt oder Kunde
- Stückliste
  - Hauptteil
  - Unterteil oder Materialgruppe
  - Menge
  - Einheit
- Änderungen
  - Teil
  - Revision
  - Grund
  - Verantwortlich
  - Prioritaet
  - Status

Später:

- echte Dateiablage
- Varianten
- Entwicklungsprojekte
- Änderungsfreigabe mit Pflichtworkflow
- CAD/PDM-Integration

## Einkauf

- Lieferanten
  - Land
  - Kategorie
  - Kontakt
  - Status
- Materialbedarf
  - Materialgruppe
  - Teil
  - Auftrag
  - Menge
  - Bedarfstermin
  - Status
- Bestellungen
  - Lieferant
  - Materialgruppe
  - Bestelldatum
  - erwarteter Termin
  - Wert
  - Status
- Wareneingang
  - Bestellung
  - Materialgruppe
  - Menge
  - Lagerort
  - Eingang

Später:

- Lieferantenbewertung
- Preisverlauf
- Einkaufsfreigaben
- automatische Bedarfsermittlung aus MRP

## Lager

- Lagerorte
  - Rohmaterial
  - Fertigteile
  - Sperrlager
  - Versand
- Bestand
  - Material oder Teil
  - Lagerort
  - Menge
  - Mindestbestand
  - Status
- Bewegungen
  - Bewegungstyp
  - von/nach Lagerort
  - Menge
  - Benutzer
  - Datum
  - Status
- Reservierungen
  - Auftrag
  - Produktionsauftrag
  - Material oder Teil
  - Bedarfstermin
  - Status

Später:

- Chargen
- Materialzeugnisse
- Inventur
- Barcode

## Produktion / MRP

- Maschinen
  - Hyundai WIA L210LMA #1
  - Hyundai WIA L210LMA #2
  - Hyundai WIA HD2200SY
  - Breuning IRCO Stangenlader als Fähigkeit der HD2200SY
- Partnerbetriebe
  - Overflow
  - Spezialbearbeitung
  - Serienentlastung
- Kapazitätsentscheidung
  - passende Maschine
  - Schichtbedarf
  - Partnerbedarf
  - Zusatzkapazitaet
  - Lieferzeit
  - Risiko
  - Entscheidung
- Arbeitspläne
  - Teil
  - Revision
  - Status
- Arbeitsgänge
  - Arbeitsplan
  - Maschine
  - Qualifikation
  - Rüstzeit
  - Zykluszeit
- Maschinenkalender
  - Maschine
  - Datum
  - Schicht
  - verfuegbare Stunden
  - gebuchte Stunden
- Produktionsaufträge
  - Kundenauftrag
  - Teil
  - freigegebene Revision
  - Menge
  - Maschine
  - Termin
- Rückmeldungen
  - Produktionsauftrag
  - Arbeitsgang
  - Mitarbeiter
  - Gutmenge
  - Ausschuss
  - Stunden

Später:

- echte Feinplanung
- Nachkalkulation
- Werkzeugplanung
- automatische Maschinenbelegung
- Partnerfertigungs-Workflow

## Qualität

- Prüfpläne
  - Teil
  - Revision
  - Verantwortlich
  - Status
- Erstteilfreigabe
  - Teil
  - Revision
  - Produktionsauftrag
  - Freigabe
- Prüfprotokolle
  - Produktionsauftrag
  - Teil
  - Prüfer
  - Ergebnis
- Reklamationen
  - Kunde
  - Auftrag
  - Grund
  - Verantwortlich
  - Status

Später:

- Messmittelverwaltung
- Lieferantenqualitaet
- Merkmalspruefung je Zeichnung
- 8D/Abweichungsprozess

## Logistik

- Lieferstatus
  - Auftrag
  - Packliste
  - Transporteur
  - DAXA-Referenz
  - Tracking
  - Versanddatum
  - Lieferdatum

Später:

- Lieferavis
- Rücksendungen
- Packvorschriften
- automatische Rechnungsgrundlage nach Versand

## Personal

- Mitarbeiter
  - Name
  - Rolle
  - Status
- Qualifikationen
  - Mitarbeiter
  - Qualifikation
  - Stufe
  - Gültigkeit
- Schichten
  - Datum
  - Mitarbeiter
  - Maschine
  - Start/Ende
- Abwesenheiten
  - Mitarbeiter
  - Typ
  - Zeitraum
  - Status

Später:

- Schulungsplanung
- Qualifikationsmatrix
- keine Lohnabrechnung ohne gesonderten Auftrag

## Finanzen

- Kostenstellen
  - Vertrieb
  - Produktion
- Rechnungen
  - Kunde
  - Auftrag
  - Datum
  - Fälligkeit
  - Netto/Steuer/Brutto
  - Status
- Gutschriften
  - Rechnung
  - Betrag
  - Grund
- Zahlungen
  - Rechnung
  - Datum
  - Betrag
  - Methode
- Offene Posten
  - Rechnung
  - Kunde
  - Fälligkeit
  - offen
- Finanzbuchungen
  - aktuell Sperrmodul
  - Aktivierung erst nach Commercialista-Prüfung

Später:

- italienische Steuer-/Buchungslogik
- FatturaPA/SDI
- Abschlusslogik
- Export für Steuerberater

## Technische Roadmap

1. Fundament: lokale App, Modulstruktur, Historie, Backup, später SQLite und Desktop.
2. Vertrieb + PDM-Kern: RFQ, Angebotsrechner, Teilstamm, Revision, Freigabe, Zeichnung.
3. Einkauf + Lager + Produktion: Bedarf, Bestellung, Wareneingang, Bestand, Reservierung, Arbeitsplan, Produktionsauftrag.
4. Personal + Qualität + Finanzen: Schicht/Qualifikation, Prüfung, Rechnungsgrundlagen, Zahlungen.
5. Vollständiges PDM + rechtliche Finanzfunktionen: Varianten, Änderungswesen, FatturaPA/SDI erst nach fachlicher Validierung.
