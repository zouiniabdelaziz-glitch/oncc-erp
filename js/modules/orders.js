(function () {
  const statusOptions = [
    { value: "neu", label: "Neu" },
    { value: "geplant", label: "Geplant" },
    { value: "in produktion", label: "In Produktion" },
    { value: "fertig", label: "Fertig" },
    { value: "versendet", label: "Versendet" },
    { value: "geliefert", label: "Geliefert" }
  ];

  function releasedRevisionOptions(data) {
    return (data.partRevisions || [])
      .filter((revision) => revision.status === "freigegeben")
      .map((revision) => {
        const part = window.OSM.state.findById(data, "parts", revision.partId);
        const partLabel = part ? `${part.partNo || part.name} - ${part.name}` : revision.partId;
        return {
          value: revision.id,
          label: `${partLabel} / Rev ${revision.revision || "-"}`
        };
      });
  }

  window.OSM.registerModule({
    id: "orders",
    group: "Vertrieb & CRM",
    icon: "O",
    title: "Aufträge",
    description: "Kundenauftraege aus gewonnenen Angeboten oder Direktauftraegen.",
    collection: "orders",
    prefix: "ord",
    fields: [
      { key: "orderNo", label: "Auftragsnummer", required: true },
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers"), required: true },
      { key: "quoteId", label: "Angebot", type: "select", options: (data, h) => h.options("quotes", "quoteNo") },
      { key: "projectId", label: "Projekt", type: "select", options: (data, h) => h.options("projects") },
      { key: "partId", label: "PDM-Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "revisionId", label: "Freigegebene Revision", type: "select", options: releasedRevisionOptions },
      { key: "quantity", label: "Stückzahl", type: "number", default: 1 },
      { key: "dueDate", label: "Liefertermin", type: "date" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "neu" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "orderNo", label: "Auftrag" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "quoteId", label: "Angebot", render: (row, data, h) => h.escapeHtml(h.label("quotes", row.quoteId, "quoteNo")) },
      { key: "partId", label: "PDM", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "quantity", label: "Menge" },
      { key: "dueDate", label: "Termin" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
