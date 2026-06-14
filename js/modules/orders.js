(function () {
  const statusOptions = [
    { value: "neu", label: "Neu" },
    { value: "geplant", label: "Geplant" },
    { value: "in produktion", label: "In Produktion" },
    { value: "fertig", label: "Fertig" },
    { value: "versendet", label: "Versendet" },
    { value: "geliefert", label: "Geliefert" }
  ];

  window.OSM.registerModule({
    id: "orders",
    group: "Produktion",
    icon: "O",
    title: "Auftraege",
    description: "Kundenauftraege aus gewonnenen Angeboten oder Direktauftraegen.",
    collection: "orders",
    prefix: "ord",
    fields: [
      { key: "orderNo", label: "Auftragsnummer", required: true },
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers"), required: true },
      { key: "quoteId", label: "Angebot", type: "select", options: (data, h) => h.options("quotes", "quoteNo") },
      { key: "projectId", label: "Projekt", type: "select", options: (data, h) => h.options("projects") },
      { key: "quantity", label: "Stueckzahl", type: "number", default: 1 },
      { key: "dueDate", label: "Liefertermin", type: "date" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "neu" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "orderNo", label: "Auftrag" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "quoteId", label: "Angebot", render: (row, data, h) => h.escapeHtml(h.label("quotes", row.quoteId, "quoteNo")) },
      { key: "quantity", label: "Menge" },
      { key: "dueDate", label: "Termin" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
