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
      now: "Kunden, Kontakte, RFQ, Angebotsrechner, Angebote, Auftraege",
      later: "Follow-ups, Angebots-PDF, Wiederholangebote",
      status: "aktiv"
    },
    {
      area: "PDM & Konstruktion",
      now: "Teile, Zeichnungen, STEP-Referenzen, Revisionen, Freigaben",
      later: "Stuecklisten, Aenderungsantraege, Varianten, Entwicklungsprojekte",
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
      now: "Maschinen, Kalender, Arbeitsplaene, Arbeitsgaenge, Fertigungsauftraege",
      later: "Rueckmeldungen, Nachkalkulation, Werkzeugplanung",
      status: "neu"
    },
    {
      area: "Qualitaet",
      now: "Pruefplan, Erstteilfreigabe, Pruefprotokoll, Reklamation",
      later: "Messmittelverwaltung, Lieferantenqualitaet",
      status: "neu"
    },
    {
      area: "Logistik",
      now: "Packliste, Versand, DAXA-Referenz, Lieferstatus",
      later: "Lieferavis, Ruecksendungen",
      status: "aktiv"
    },
    {
      area: "Personal",
      now: "Mitarbeiter, Qualifikationen, Schichten, Verfuegbarkeit, Abwesenheit",
      later: "Schulungsplanung, keine Lohnabrechnung ohne Auftrag",
      status: "neu"
    },
    {
      area: "Finanzen",
      now: "Rechnungsgrundlage, Zahlungen, offene Posten, Kostenstellen",
      later: "Italienische Steuerlogik, FatturaPA/SDI, Abschluesse nach Pruefung",
      status: "gesperrt"
    }
  ];

  const workflows = [
    "Kunde -> RFQ -> Teilrevision -> Angebotsrechner -> Angebot -> Auftrag -> Produktionsauftrag -> Versand -> Rechnung -> Zahlung",
    "Teil -> Revision -> Stueckliste -> Arbeitsplan -> Materialreservierung -> Einkauf oder Lagerentnahme",
    "Mitarbeiter + Qualifikation + Verfuegbarkeit -> Schicht -> Arbeitsgang"
  ];

  const phases = [
    "Phase 1: Fundament mit Datenmodell, Rollen, Historie, Backup und spaeter Desktop-App.",
    "Phase 2: Vertrieb und PDM-Kern mit RFQ, Teil, Revision, Freigabe und Zeichnung.",
    "Phase 3: Einkauf, Lager und Produktion mit Bedarf, Bestand, Reservierung und Fertigungsauftrag.",
    "Phase 4: Personal, Qualitaet und Finanzen als kontrollierte Erweiterung.",
    "Phase 5: Vollstaendiges PDM und rechtsrelevante Finanzfunktionen erst nach externer Validierung."
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
    description: "ERP/PDM-Struktur fuer OS.MECHPLAST: jetzt sichtbar, spaeter ausbaubar.",
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
            <p class="topbar__text">Schlank starten, aber fachlich sauber wachsen: ERP fuer Geschaeftsvorgaenge, PDM fuer Teile, Zeichnungen, Revisionen und Freigaben.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#dashboard">Zurueck</a>
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
              <div class="module-card__label">Spaeter</div>
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
