(function () {
  const riskOptions = [
    { value: "niedrig", label: "Niedrig" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" }
  ];

  window.OSM.registerModule({
    id: "materials",
    group: "Stammdaten",
    icon: "W",
    title: "Materialgruppen",
    description: "Materialfamilien fuer RFQ, Angebot und Kapazitaetsentscheidung.",
    collection: "materials",
    prefix: "mat",
    fields: [
      { key: "name", label: "Materialgruppe", required: true },
      { key: "risk", label: "Risiko", type: "select", options: riskOptions, default: "niedrig" },
      { key: "machinability", label: "Zerspanbarkeit" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Material" },
      { key: "risk", label: "Risiko", render: (row, data, h) => h.badge(row.risk, h.toneForStatus(row.risk)) },
      { key: "machinability", label: "Zerspanbarkeit" },
      { key: "notes", label: "Notiz" }
    ]
  });
})();
