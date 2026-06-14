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

  window.OSM.registerModule({
    id: "rfqs",
    group: "Sales / RFQ",
    icon: "R",
    title: "RFQs / Anfragen",
    description: "Anfragen mit Zeichnungsreferenz, Material, Menge und Terminwunsch.",
    collection: "rfqs",
    prefix: "rfq",
    fields: [
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers"), required: true },
      { key: "contactId", label: "Kontakt", type: "select", options: (data, h) => h.options("contacts") },
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
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "quantity", label: "Menge" },
      { key: "dueDate", label: "Termin" },
      { key: "decision", label: "Entscheidung", render: (row, data, h) => {
        const decision = h.decision(row);
        return `${h.badge(decision.decision, h.toneForStatus(decision.decision))}<div class="small muted">${h.escapeHtml(decision.machineName)}</div>`;
      }},
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
