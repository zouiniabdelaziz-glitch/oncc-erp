(function () {
  const statusOptions = [
    { value: "aktiv", label: "Aktiv" },
    { value: "in pruefung", label: "In Pruefung" },
    { value: "gesperrt", label: "Gesperrt" },
    { value: "archiv", label: "Archiv" }
  ];

  window.OSM.registerModule({
    id: "companies",
    group: "System & Rechte",
    icon: "G",
    title: "Gesellschaft",
    description: "Mandant/Gesellschaft fuer das ERP. V1 startet nur mit OS.MECHPLAST SRLS.",
    collection: "companies",
    prefix: "cmp",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "country", label: "Land" },
      { key: "legalForm", label: "Rechtsform" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Gesellschaft" },
      { key: "country", label: "Land" },
      { key: "legalForm", label: "Rechtsform" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "roles",
    group: "System & Rechte",
    icon: "R",
    title: "Rollen",
    description: "Einfache Rollen nach Bereich. Echte Anmeldung/Rechte kommen mit Desktop/DB-Ausbau.",
    collection: "roles",
    prefix: "rol",
    fields: [
      { key: "name", label: "Rollenname", required: true },
      { key: "area", label: "Bereich" },
      { key: "accessLevel", label: "Zugriff" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Rolle" },
      { key: "area", label: "Bereich" },
      { key: "accessLevel", label: "Zugriff" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "number-ranges",
    group: "System & Rechte",
    icon: "N",
    title: "Nummernkreise",
    description: "Nummernlogik fuer RFQ, Angebote, Auftraege, Rechnungen und spaetere Belege.",
    collection: "numberRanges",
    prefix: "num",
    fields: [
      { key: "code", label: "Code", required: true },
      { key: "pattern", label: "Muster" },
      { key: "nextNumber", label: "Naechste Nummer", type: "number", default: 1 },
      { key: "ownerArea", label: "Bereich" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "pattern", label: "Muster" },
      { key: "nextNumber", label: "Naechste" },
      { key: "ownerArea", label: "Bereich" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "audit-log",
    group: "System & Rechte",
    icon: "H",
    title: "Historie",
    description: "Automatisches Protokoll fuer Aenderungen, Freigaben, Lagerbewegungen und Finanzbuchungen.",
    render(data, h) {
      const rows = (data.auditLogs || []).slice(0, 80);
      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-system">System & Rechte</a>
            </div>
            <h1 class="topbar__title">Historie</h1>
            <p class="topbar__text">Jede gespeicherte Aenderung wird mit Zeit, Benutzer, Modul und Datensatz protokolliert.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-system">Zurueck</a>
          </div>
        </div>
        <section class="panel">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Zeit</th>
                  <th>Benutzer</th>
                  <th>Modul</th>
                  <th>Aktion</th>
                  <th>Zusammenfassung</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map((row) => `
                  <tr>
                    <td>${h.escapeHtml(row.timestamp || "-")}</td>
                    <td>${h.escapeHtml(row.user || "-")}</td>
                    <td>${h.escapeHtml(row.collection || "-")}</td>
                    <td>${h.badge(row.action || "-", h.toneForStatus(row.action))}</td>
                    <td>${h.escapeHtml(row.summary || row.recordId || "-")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>
      `;
    }
  });
})();
