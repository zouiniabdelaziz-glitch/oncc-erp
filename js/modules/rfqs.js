(function () {
  const statusOptions = [
    { value: "neu", label: "Neu" },
    { value: "in pruefung", label: "In Pruefung" },
    { value: "angebot erstellt", label: "Angebot erstellt" },
    { value: "gewonnen", label: "Gewonnen" },
    { value: "abgelehnt", label: "Abgelehnt" }
  ];
  const partTypes = [
    { value: "drehen", label: "Drehen" },
    { value: "dreh-fraes", label: "Dreh-Fraes" },
    { value: "fraesen", label: "Fraesen / Partner pruefen" }
  ];
  const complexityOptions = [
    { value: "einfach", label: "Einfach" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" }
  ];
  const toleranceOptions = [
    { value: "normal", label: "Normal" },
    { value: "eng", label: "Eng" },
    { value: "kritisch", label: "Kritisch" }
  ];

  function revisionOptions(data) {
    return (data.partRevisions || []).map((revision) => {
      const part = window.OSM.state.findById(data, "parts", revision.partId);
      const partLabel = part ? `${part.partNo || part.name} - ${part.name}` : revision.partId;
      return {
        value: revision.id,
        label: `${partLabel} / Rev ${revision.revision || "-"} (${revision.status || "-"})`
      };
    });
  }

  window.OSM.registerModule({
    id: "rfqs",
    group: "Vertrieb & CRM",
    icon: "R",
    title: "RFQs / Anfragen",
    description: "Anfragen mit Zeichnungsreferenz, Material, Menge und Terminwunsch.",
    collection: "rfqs",
    prefix: "rfq",
    fields: [
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers"), required: true },
      { key: "contactId", label: "Kontakt", type: "select", options: (data, h) => h.options("contacts") },
      { key: "partId", label: "PDM-Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "revisionId", label: "Teilrevision", type: "select", options: revisionOptions },
      { key: "partName", label: "Teil / Bezeichnung", required: true },
      { key: "partType", label: "Teiletyp", type: "select", options: partTypes, default: "drehen" },
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials"), required: true },
      { key: "quantity", label: "Stueckzahl", type: "number", default: 1 },
      { key: "dueDate", label: "Terminwunsch", type: "date" },
      { key: "complexity", label: "Komplexitaet", type: "select", options: complexityOptions, default: "mittel" },
      { key: "tolerance", label: "Toleranz", type: "select", options: toleranceOptions, default: "normal" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "neu" },
      { key: "fileRef", label: "Zeichnung / Datei-Referenz" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partName", label: "Teil" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "partId", label: "PDM", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "quantity", label: "Menge" },
      { key: "dueDate", label: "Termin" },
      { key: "decision", label: "Entscheidung", render: (row, data, h) => {
        const decision = h.decision(row);
        return `${h.badge(decision.decision, h.toneForStatus(decision.decision))}<div class="small muted">${h.escapeHtml(decision.machineName)}</div>`;
      }},
      { key: "calculator", label: "Rechner", render: (row, data, h) => `
        <button class="icon-button" onclick="window.OSM_CALCULATOR.openFromRfq('${h.escapeHtml(row.id)}')">Rechnen</button>
      ` },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
