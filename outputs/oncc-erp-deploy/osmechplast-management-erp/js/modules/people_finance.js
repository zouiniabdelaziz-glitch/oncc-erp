(function () {
  const activeStatus = [
    { value: "aktiv", label: "Aktiv" },
    { value: "in pruefung", label: "In Prüfung" },
    { value: "gesperrt", label: "Gesperrt" },
    { value: "archiv", label: "Archiv" }
  ];
  const shiftStatus = [
    { value: "geplant", label: "Geplant" },
    { value: "bestätigt", label: "Bestaetigt" },
    { value: "ausgefallen", label: "Ausgefallen" }
  ];
  const invoiceStatus = [
    { value: "entwurf", label: "Entwurf" },
    { value: "gesendet", label: "Gesendet" },
    { value: "teilbezahlt", label: "Teilbezahlt" },
    { value: "bezahlt", label: "Bezahlt" },
    { value: "storniert", label: "Storniert" },
    { value: "commercialista offen", label: "Commercialista offen" }
  ];
  const paymentStatus = [
    { value: "offen", label: "Offen" },
    { value: "gebucht", label: "Gebucht" },
    { value: "storniert", label: "Storniert" }
  ];

  window.OSM.registerModule({
    id: "employees",
    group: "Personal",
    icon: "M",
    title: "Mitarbeiter",
    description: "Mitarbeiter für Einsatzplanung, Qualifikation und Fertigungsrueckmeldung.",
    collection: "employees",
    prefix: "emp",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Rolle / Einsatz" },
      { key: "status", label: "Status", type: "select", options: activeStatus, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Mitarbeiter" },
      { key: "role", label: "Rolle" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "employee-skills",
    group: "Personal",
    icon: "Q",
    title: "Qualifikationen",
    description: "Qualifikationen für Maschinen, Prozesse und pruefpflichtige Arbeiten.",
    collection: "employeeSkills",
    prefix: "esk",
    fields: [
      { key: "employeeId", label: "Mitarbeiter", type: "select", options: (data, h) => h.options("employees"), required: true },
      { key: "skill", label: "Qualifikation", required: true },
      { key: "level", label: "Stufe" },
      { key: "validUntil", label: "Gültig bis", type: "date" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "employeeId", label: "Mitarbeiter", render: (row, data, h) => h.escapeHtml(h.label("employees", row.employeeId)) },
      { key: "skill", label: "Qualifikation" },
      { key: "level", label: "Stufe", render: (row, data, h) => h.badge(row.level, h.toneForStatus(row.level)) },
      { key: "validUntil", label: "Gültig bis" }
    ]
  });

  window.OSM.registerModule({
    id: "shifts",
    group: "Personal",
    icon: "S",
    title: "Schichten",
    description: "Einfache Schicht- und Maschinenzuordnung. Keine Lohnabrechnung in V1.",
    collection: "shifts",
    prefix: "shf",
    fields: [
      { key: "date", label: "Datum", type: "date" },
      { key: "shiftName", label: "Schicht", required: true },
      { key: "employeeId", label: "Mitarbeiter", type: "select", options: (data, h) => h.options("employees") },
      { key: "machineId", label: "Maschine", type: "select", options: (data, h) => h.options("machines") },
      { key: "startTime", label: "Start" },
      { key: "endTime", label: "Ende" },
      { key: "status", label: "Status", type: "select", options: shiftStatus, default: "geplant" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "date", label: "Datum" },
      { key: "shiftName", label: "Schicht" },
      { key: "employeeId", label: "Mitarbeiter", render: (row, data, h) => h.escapeHtml(h.label("employees", row.employeeId)) },
      { key: "machineId", label: "Maschine", render: (row, data, h) => h.escapeHtml(h.label("machines", row.machineId)) },
      { key: "startTime", label: "Start" },
      { key: "endTime", label: "Ende" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "absences",
    group: "Personal",
    icon: "A",
    title: "Abwesenheiten",
    description: "Abwesenheiten für Kapazitäts- und Schichtplanung.",
    collection: "absences",
    prefix: "abs",
    fields: [
      { key: "employeeId", label: "Mitarbeiter", type: "select", options: (data, h) => h.options("employees"), required: true },
      { key: "type", label: "Typ", required: true },
      { key: "startDate", label: "Von", type: "date" },
      { key: "endDate", label: "Bis", type: "date" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "geplant", label: "Geplant" },
        { value: "bestätigt", label: "Bestaetigt" },
        { value: "storniert", label: "Storniert" }
      ], default: "geplant" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "employeeId", label: "Mitarbeiter", render: (row, data, h) => h.escapeHtml(h.label("employees", row.employeeId)) },
      { key: "type", label: "Typ" },
      { key: "startDate", label: "Von" },
      { key: "endDate", label: "Bis" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "cost-centers",
    group: "Finanzen",
    icon: "K",
    title: "Kostenstellen",
    description: "Einfache Kostenstellen für Management-Auswertung und spätere Nachkalkulation.",
    collection: "costCenters",
    prefix: "cst",
    fields: [
      { key: "code", label: "Code", required: true },
      { key: "name", label: "Name", required: true },
      { key: "area", label: "Bereich" },
      { key: "status", label: "Status", type: "select", options: activeStatus, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Kostenstelle" },
      { key: "area", label: "Bereich" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "invoices",
    group: "Finanzen",
    icon: "R",
    title: "Rechnungen",
    description: "Rechnungsgrundlagen für Aufträge. Rechtsverbindliche italienische Logik bleibt gesperrt.",
    collection: "invoices",
    prefix: "inv",
    fields: [
      { key: "invoiceNo", label: "Rechnungsnummer", required: true },
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers"), required: true },
      { key: "orderId", label: "Auftrag", type: "select", options: (data, h) => h.options("orders", "orderNo") },
      { key: "invoiceDate", label: "Rechnungsdatum", type: "date" },
      { key: "dueDate", label: "Fällig", type: "date" },
      { key: "netAmount", label: "Netto EUR", type: "number", default: 0 },
      { key: "taxAmount", label: "Steuer EUR", type: "number", default: 0 },
      { key: "großAmount", label: "Brutto EUR", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: invoiceStatus, default: "commercialista offen" },
      { key: "notes", label: "Notizen / Sperrhinweis", type: "textarea", wide: true }
    ],
    columns: [
      { key: "invoiceNo", label: "Rechnung" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "orderId", label: "Auftrag", render: (row, data, h) => h.escapeHtml(h.label("orders", row.orderId, "orderNo")) },
      { key: "invoiceDate", label: "Datum" },
      { key: "großAmount", label: "Brutto", render: (row) => row.großAmount ? `${Number(row.großAmount).toLocaleString("de-DE")} EUR` : "-" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "credit-notes",
    group: "Finanzen",
    icon: "G",
    title: "Gutschriften",
    description: "Gutschriften als einfache Beleggrundlage, ohne Steuerautomatismus.",
    collection: "creditNotes",
    prefix: "crn",
    fields: [
      { key: "creditNo", label: "Gutschriftnummer", required: true },
      { key: "invoiceId", label: "Rechnung", type: "select", options: (data, h) => h.options("invoices", "invoiceNo") },
      { key: "date", label: "Datum", type: "date" },
      { key: "amount", label: "Betrag EUR", type: "number", default: 0 },
      { key: "reason", label: "Grund" },
      { key: "status", label: "Status", type: "select", options: invoiceStatus, default: "entwurf" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "creditNo", label: "Gutschrift" },
      { key: "invoiceId", label: "Rechnung", render: (row, data, h) => h.escapeHtml(h.label("invoices", row.invoiceId, "invoiceNo")) },
      { key: "date", label: "Datum" },
      { key: "amount", label: "Betrag", render: (row) => row.amount ? `${Number(row.amount).toLocaleString("de-DE")} EUR` : "-" },
      { key: "reason", label: "Grund" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "payments",
    group: "Finanzen",
    icon: "Z",
    title: "Zahlungen",
    description: "Zahlungseingaenge und Ausgleich offener Posten als Managementsicht.",
    collection: "payments",
    prefix: "pay",
    fields: [
      { key: "invoiceId", label: "Rechnung", type: "select", options: (data, h) => h.options("invoices", "invoiceNo") },
      { key: "paymentDate", label: "Zahlungsdatum", type: "date" },
      { key: "amount", label: "Betrag EUR", type: "number", default: 0 },
      { key: "method", label: "Methode" },
      { key: "status", label: "Status", type: "select", options: paymentStatus, default: "offen" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "invoiceId", label: "Rechnung", render: (row, data, h) => h.escapeHtml(h.label("invoices", row.invoiceId, "invoiceNo")) },
      { key: "paymentDate", label: "Datum" },
      { key: "amount", label: "Betrag", render: (row) => row.amount ? `${Number(row.amount).toLocaleString("de-DE")} EUR` : "-" },
      { key: "method", label: "Methode" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "open-items",
    group: "Finanzen",
    icon: "O",
    title: "Offene Posten",
    description: "Offene Forderungen/Belege als einfache Übersicht.",
    collection: "openItems",
    prefix: "opi",
    fields: [
      { key: "invoiceId", label: "Rechnung", type: "select", options: (data, h) => h.options("invoices", "invoiceNo") },
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers") },
      { key: "dueDate", label: "Fällig", type: "date" },
      { key: "amountOpen", label: "Offen EUR", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: [
        { value: "offen", label: "Offen" },
        { value: "ueberfaellig", label: "Überfällig" },
        { value: "bezahlt", label: "Bezahlt" }
      ], default: "offen" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "invoiceId", label: "Rechnung", render: (row, data, h) => h.escapeHtml(h.label("invoices", row.invoiceId, "invoiceNo")) },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "dueDate", label: "Fällig" },
      { key: "amountOpen", label: "Offen", render: (row) => row.amountOpen ? `${Number(row.amountOpen).toLocaleString("de-DE")} EUR` : "-" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "finance-postings",
    group: "Finanzen",
    icon: "F",
    title: "Finanzbuchungen",
    description: "Sperrmodul für spätere Buchungslogik. Aktivierung erst nach Commercialista-Prüfung.",
    collection: "financePostings",
    prefix: "fpo",
    fields: [
      { key: "date", label: "Datum", type: "date" },
      { key: "documentNo", label: "Beleg", required: true },
      { key: "type", label: "Typ" },
      { key: "costCenterId", label: "Kostenstelle", type: "select", options: (data, h) => h.options("costCenters", "code") },
      { key: "amount", label: "Betrag EUR", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: invoiceStatus, default: "commercialista offen" },
      { key: "lockedReason", label: "Sperrgrund", type: "textarea", wide: true },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "date", label: "Datum" },
      { key: "documentNo", label: "Beleg" },
      { key: "type", label: "Typ" },
      { key: "costCenterId", label: "Kostenstelle", render: (row, data, h) => h.escapeHtml(h.label("costCenters", row.costCenterId, "code")) },
      { key: "amount", label: "Betrag", render: (row) => row.amount ? `${Number(row.amount).toLocaleString("de-DE")} EUR` : "-" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
