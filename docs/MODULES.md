# OS.MECHPLAST Management ERP - Modulstruktur

Ziel: klein starten, aber jedes Thema als Modul halten. Was gross wird, wird in kleinere Module geteilt.

## Start

- Dashboard
  - Offene Aufgaben
  - Aktive Projekte
  - Offene RFQs
  - Offene Auftraege
  - RFQ-Entscheidungen

## Management

- Projekte
  - Interne Projekte
  - Kundenprojekte
  - Prozessverbesserungen
  - ERP-Ausbau
- Aufgaben
  - Verantwortliche
  - Faelligkeit
  - Prioritaet
  - Status

Spaeter moegliche Unterteilung:

- Aufgabenliste
- Projektplan
- Wiederkehrende Aufgaben
- Wochenplanung
- Management-Report

## CRM

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

Spaeter moegliche Unterteilung:

- Zielkunden
- Bestandskunden
- Buying-Center
- Aktivitaeten / Follow-ups

## Sales / RFQ

- RFQs / Anfragen
  - Kunde
  - Teil
  - Materialgruppe
  - Stueckzahl
  - Terminwunsch
  - Komplexitaet
  - Toleranz
- Dateien / Zeichnungen
  - PDF
  - STEP
  - DXF
  - Versionshinweise
- Angebote
  - Angebotsnummer
  - Lieferzeit
  - Preisstatus
  - Risiko
  - Entscheidung

Spaeter moegliche Unterteilung:

- Angebotspositionen
- Angebots-PDF
- Nachfassen
- Preislogik
- Wiederholangebote

## Produktion

- Auftraege
  - Auftragsnummer
  - Kunde
  - Menge
  - Liefertermin
  - Status
- Kapazitaetsentscheidung
  - passende Maschine
  - Schichtbedarf
  - Partnerbedarf
  - Zusatzkapazitaet
  - Lieferzeit
  - Risiko
  - Entscheidung

Spaeter moegliche Unterteilung:

- Produktionsplanung
- Maschinenkalender
- Arbeitsgaenge
- Rueckmeldung
- Nachkalkulation

## Logistik

- Lieferstatus
  - Auftrag
  - Transporteur
  - Tracking / Referenz
  - Versanddatum
  - Lieferdatum

Spaeter moegliche Unterteilung:

- DAXA-Versand
- Packliste
- Lieferavis
- Reklamation / Problemfaelle

## Stammdaten

- Maschinen
  - Hyundai WIA L210LMA #1
  - Hyundai WIA L210LMA #2
  - Hyundai WIA HD2200SY
  - Breuning IRCO Stangenlader als Faehigkeit der HD2200SY
- Materialgruppen
  - Kunststoff
  - Aluminium
  - zerspanbarer Stahl
- Partnerbetriebe
  - Overflow
  - Spezialbearbeitung
  - Serienentlastung

Spaeter moegliche Unterteilung:

- Maschinenfaehigkeiten
- Materialdetails
- Lieferanten
- Partnerbewertung

## System

- Daten & Module
  - Backup exportieren
  - Backup importieren
  - Demo-Daten wiederherstellen
  - Moduluebersicht

Spaeter:

- Benutzer
- Rechte
- SQLite-Backup
- Cloud-Sync optional
- Tauri-.exe-Build
