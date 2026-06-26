(function () {
  const statusOptions = [
    { value: "entwurf", label: "Entwurf" },
    { value: "gesendet", label: "Gesendet" },
    { value: "gewonnen", label: "Gewonnen" },
    { value: "verloren", label: "Verloren" }
  ];
  const priceOptions = [
    { value: "offen", label: "Offen" },
    { value: "geschaetzt", label: "Geschaetzt" },
    { value: "final", label: "Final" }
  ];
  const riskOptions = [
    { value: "niedrig", label: "Niedrig" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" }
  ];
  const decisionOptions = [
    { value: "anbieten", label: "Anbieten" },
    { value: "pruefen", label: "Pruefen" },
    { value: "ablehnen", label: "Ablehnen" }
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
    id: "quotes",
    group: "Vertrieb & CRM",
    icon: "A",
    title: "Angebote",
    description: "Angebote als Ergebnis der RFQ- und Kapazitaetspruefung.",
    collection: "quotes",
    prefix: "quo",
    fields: [
      { key: "rfqId", label: "RFQ", type: "select", options: (data, h) => h.options("rfqs", "partName"), required: true },
      { key: "partId", label: "PDM-Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "revisionId", label: "Freigegebene Revision", type: "select", options: releasedRevisionOptions },
      { key: "quoteNo", label: "Angebotsnummer", required: true },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "entwurf" },
      { key: "validUntil", label: "Gueltig bis", type: "date" },
      { key: "leadTime", label: "Lieferzeit" },
      { key: "priceStatus", label: "Preisstatus", type: "select", options: priceOptions, default: "offen" },
      { key: "offerPrice", label: "Angebotspreis EUR", type: "number", default: 0 },
      { key: "unitPrice", label: "Stueckpreis EUR", type: "number", default: 0 },
      { key: "machineName", label: "Maschine" },
      { key: "risk", label: "Risiko", type: "select", options: riskOptions, default: "mittel" },
      { key: "decision", label: "Entscheidung", type: "select", options: decisionOptions, default: "pruefen" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "quoteNo", label: "Angebot" },
      { key: "rfqId", label: "RFQ", render: (row, data, h) => h.escapeHtml(h.label("rfqs", row.rfqId, "partName")) },
      { key: "partId", label: "PDM", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "leadTime", label: "Lieferzeit" },
      { key: "offerPrice", label: "Preis", render: (row) => row.offerPrice ? `${Number(row.offerPrice).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR` : "-" },
      { key: "unitPrice", label: "Stueckpreis", render: (row) => row.unitPrice ? `${Number(row.unitPrice).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR` : "-" },
      { key: "risk", label: "Risiko", render: (row, data, h) => h.badge(row.risk, h.toneForStatus(row.risk)) },
      { key: "decision", label: "Entscheidung", render: (row, data, h) => h.badge(row.decision, h.toneForStatus(row.decision)) },
      { key: "validUntil", label: "Gueltig bis" }
    ]
  });
})();
