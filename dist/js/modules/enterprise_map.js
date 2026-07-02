(function () {
  const categories = [
    {
      area: "System & Rechte",
      now: "Gesellschaft, Rollen, Historie, Nummernkreise, Backups",
      later: "Desktop-Client, zentrale DB, Cloud-Sync, Integrationen",
      status: "fundament"
    },
    {
      area: "Management",
      now: "Dashboard, Projekte, Aufgaben, Kennzahlen",
      later: "Monatsreport, Plan/Ist-Auswertung",
      status: "aktiv"
    },
    {
      area: "Vertrieb & CRM",
      now: "Kunden, Kontakte, RFQ, Angebotsrechner, Angebote, Aufträge",
      later: "Follow-ups, Angebots-PDF, Wiederholangebote",
      status: "aktiv"
    },
    {
      area: "PDM & Konstruktion",
      now: "Teile, Zeichnungen, STEP-Referenzen, Revisionen, Freigaben",
      later: "Stücklisten, Änderungsantraege, Varianten, Entwicklungsprojekte",
      status: "neu"
    },
    {
      area: "Einkauf",
      now: "Lieferanten, Materialbedarf, Bestellungen, Wareneingang",
      later: "Lieferantenbewertung, Preisverlauf, Freigaberegeln",
      status: "neu"
    },
    {
      area: "Lager",
      now: "Lagerorte, Bestand, Bewegungen, Reservierungen, Mindestbestand",
      later: "Chargen, Zeugnisse, Inventur, Barcode",
      status: "neu"
    },
    {
      area: "Produktion & MRP",
      now: "Maschinen, Kalender, Arbeitspläne, Arbeitsgänge, Fertigungsaufträge",
      later: "Rückmeldungen, Nachkalkulation, Werkzeugplanung",
      status: "neu"
    },
    {
      area: "Qualität",
      now: "Prüfplan, Erstteilfreigabe, Prüfprotokoll, Reklamation",
      later: "Messmittelverwaltung, Lieferantenqualitaet",
      status: "neu"
    },
    {
      area: "Logistik",
      now: "Packliste, Versand, DAXA-Referenz, Lieferstatus",
      later: "Lieferavis, Rücksendungen",
      status: "aktiv"
    },
    {
      area: "Personal",
      now: "Mitarbeiter, Qualifikationen, Schichten, Verfügbarkeit, Abwesenheit",
      later: "Schulungsplanung, keine Lohnabrechnung ohne Auftrag",
      status: "neu"
    },
    {
      area: "Finanzen",
      now: "Rechnungsgrundlage, Zahlungen, offene Posten, Kostenstellen",
      later: "Italienische Steuerlogik, FatturaPA/SDI, Abschlüsse nach Prüfung",
      status: "gesperrt"
    }
  ];

  const workflows = [
    "Kunde -> RFQ -> Teilrevision -> Angebotsrechner -> Angebot -> Auftrag -> Produktionsauftrag -> Versand -> Rechnung -> Zahlung",
    "Teil -> Revision -> Stückliste -> Arbeitsplan -> Materialreservierung -> Einkauf oder Lagerentnahme",
    "Mitarbeiter + Qualifikation + Verfügbarkeit -> Schicht -> Arbeitsgang"
  ];

  const phases = [
    "Phase 1: Fundament mit Datenmodell, Rollen, Historie, Backup und später Desktop-App.",
    "Phase 2: Vertrieb und PDM-Kern mit RFQ, Teil, Revision, Freigabe und Zeichnung.",
    "Phase 3: Einkauf, Lager und Produktion mit Bedarf, Bestand, Reservierung und Fertigungsauftrag.",
    "Phase 4: Personal, Qualität und Finanzen als kontrollierte Erweiterung.",
    "Phase 5: Vollständiges PDM und rechtsrelevante Finanzfunktionen erst nach externer Validierung."
  ];

  function tone(status) {
    if (["aktiv", "neu"].includes(status)) return "ok";
    if (status === "fundament") return "warn";
    return "danger";
  }

  window.OSM.registerModule({
    id: "module-map",
    group: "Start",
    icon: "M",
    title: "Modul-Landkarte",
    description: "ERP/PDM-Struktur für OS.MECHPLAST: jetzt sichtbar, später ausbaubar.",
    render(data, h) {
      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <span>Modul-Landkarte</span>
            </div>
            <h1 class="topbar__title">Modul-Landkarte</h1>
            <p class="topbar__text">Schlank starten, aber fachlich sauber wachsen: ERP für Geschäftsvorgaenge, PDM für Teile, Zeichnungen, Revisionen und Freigaben.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#dashboard">Zurück</a>
          </div>
        </div>

        <section class="module-map">
          ${categories.map((category) => `
            <article class="module-card">
              <div class="module-card__head">
                <h2>${h.escapeHtml(category.area)}</h2>
                ${h.badge(category.status, tone(category.status))}
              </div>
              <div class="module-card__label">Jetzt</div>
              <p>${h.escapeHtml(category.now)}</p>
              <div class="module-card__label">Später</div>
              <p>${h.escapeHtml(category.later)}</p>
            </article>
          `).join("")}
        </section>

        <section class="grid grid--two module-map__bottom">
          <div class="panel panel--pad">
            <h2>Verbindliche Ablaeufe</h2>
            <div class="list">
              ${workflows.map((workflow) => `
                <div class="list-item">
                  <div class="list-item__title">${h.escapeHtml(workflow)}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Ausbauphasen</h2>
            <div class="list">
              ${phases.map((phase) => `
                <div class="list-item">
                  <div class="list-item__meta">${h.escapeHtml(phase)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    }
  });
})();
