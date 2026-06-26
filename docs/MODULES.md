# OS.MECHPLAST Management ERP - Modulstruktur

Ziel: klein starten, aber fachlich richtig schneiden. Jedes Thema bleibt ein eigenes Modul. Wenn ein Modul zu gross wird, wird es in kleinere Module geteilt.

## Grundprinzip

- ERP verwaltet Geschaeftsvorgaenge: Kunde, RFQ, Angebot, Auftrag, Einkauf, Lager, Produktion, Versand, Rechnung, Zahlung.
- PDM ist die verbindliche Quelle fuer Teil, Zeichnung, STEP, Revision, Freigabe, Stueckliste und Aenderung.
- MRP verbindet Bedarf, Bestand, Reservierung, Einkauf, Maschine, Mitarbeiter, Qualifikation und Kapazitaet.
- Finanzen bleibt am Anfang Management- und Rechnungsgrundlage, nicht rechtsverbindliche Buchhaltung.

## Verbindliche Ablaeufe

- Kunde -> RFQ -> Teilrevision -> Angebotsrechner -> Angebot -> Auftrag -> Produktionsauftrag -> Versand -> Rechnung -> Zahlung
- Teil -> Revision -> Stueckliste -> Arbeitsplan -> Materialreservierung -> Einkauf oder Lagerentnahme
- Mitarbeiter + Qualifikation + Verfuegbarkeit -> Schicht -> Arbeitsgang

Nur freigegebene Teilrevisionen sollen in Angebot, Auftrag und Produktion verwendet werden. Der Angebotsrechner blockiert bekannte nicht freigegebene Revisionen beim Speichern eines Angebots.

## Start

- Dashboard
  - Aufgaben, Projekte, RFQs, Auftraege
  - Materialbedarf, Reservierungen, Fertigungsauftraege
  - PDM-Freigaben und Finanz-Sperren
- Modul-Landkarte
  - Bereiche jetzt/spaeter
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
  - Moduluebersicht

Spaeter:

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
  - Faelligkeit
  - Prioritaet
  - Status

Spaeter:

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
  - Stueckzahl
  - Terminwunsch
  - Komplexitaet
  - Toleranz
- Angebotsrechner
  - Maschinenfit
  - Maschinenkalender
  - Kapazitaetspruefung
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
- Auftraege
  - Angebotsbezug
  - PDM-Teil
  - freigegebene Revision
  - Menge
  - Termin
  - Status

Spaeter:

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
- Stueckliste
  - Hauptteil
  - Unterteil oder Materialgruppe
  - Menge
  - Einheit
- Aenderungen
  - Teil
  - Revision
  - Grund
  - Verantwortlich
  - Prioritaet
  - Status

Spaeter:

- echte Dateiablage
- Varianten
- Entwicklungsprojekte
- Aenderungsfreigabe mit Pflichtworkflow
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

Spaeter:

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

Spaeter:

- Chargen
- Materialzeugnisse
- Inventur
- Barcode

## Produktion / MRP

- Maschinen
  - Hyundai WIA L210LMA #1
  - Hyundai WIA L210LMA #2
  - Hyundai WIA HD2200SY
  - Breuning IRCO Stangenlader als Faehigkeit der HD2200SY
- Partnerbetriebe
  - Overflow
  - Spezialbearbeitung
  - Serienentlastung
- Kapazitaetsentscheidung
  - passende Maschine
  - Schichtbedarf
  - Partnerbedarf
  - Zusatzkapazitaet
  - Lieferzeit
  - Risiko
  - Entscheidung
- Arbeitsplaene
  - Teil
  - Revision
  - Status
- Arbeitsgaenge
  - Arbeitsplan
  - Maschine
  - Qualifikation
  - Ruestzeit
  - Zykluszeit
- Maschinenkalender
  - Maschine
  - Datum
  - Schicht
  - verfuegbare Stunden
  - gebuchte Stunden
- Produktionsauftraege
  - Kundenauftrag
  - Teil
  - freigegebene Revision
  - Menge
  - Maschine
  - Termin
- Rueckmeldungen
  - Produktionsauftrag
  - Arbeitsgang
  - Mitarbeiter
  - Gutmenge
  - Ausschuss
  - Stunden

Spaeter:

- echte Feinplanung
- Nachkalkulation
- Werkzeugplanung
- automatische Maschinenbelegung
- Partnerfertigungs-Workflow

## Qualitaet

- Pruefplaene
  - Teil
  - Revision
  - Verantwortlich
  - Status
- Erstteilfreigabe
  - Teil
  - Revision
  - Produktionsauftrag
  - Freigabe
- Pruefprotokolle
  - Produktionsauftrag
  - Teil
  - Pruefer
  - Ergebnis
- Reklamationen
  - Kunde
  - Auftrag
  - Grund
  - Verantwortlich
  - Status

Spaeter:

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

Spaeter:

- Lieferavis
- Ruecksendungen
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
  - Gueltigkeit
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

Spaeter:

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
  - Faelligkeit
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
  - Faelligkeit
  - offen
- Finanzbuchungen
  - aktuell Sperrmodul
  - Aktivierung erst nach Commercialista-Pruefung

Spaeter:

- italienische Steuer-/Buchungslogik
- FatturaPA/SDI
- Abschlusslogik
- Export fuer Steuerberater

## Technische Roadmap

1. Fundament: lokale App, Modulstruktur, Historie, Backup, spaeter SQLite und Desktop.
2. Vertrieb + PDM-Kern: RFQ, Angebotsrechner, Teilstamm, Revision, Freigabe, Zeichnung.
3. Einkauf + Lager + Produktion: Bedarf, Bestellung, Wareneingang, Bestand, Reservierung, Arbeitsplan, Produktionsauftrag.
4. Personal + Qualitaet + Finanzen: Schicht/Qualifikation, Pruefung, Rechnungsgrundlagen, Zahlungen.
5. Vollstaendiges PDM + rechtliche Finanzfunktionen: Varianten, Aenderungswesen, FatturaPA/SDI erst nach fachlicher Validierung.
