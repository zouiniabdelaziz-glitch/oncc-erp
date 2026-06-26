(function () {
  const statusOptions = [
    { value: "potenziell", label: "Potenziell" },
    { value: "aktiv", label: "Aktiv" },
    { value: "gesperrt", label: "Gesperrt" }
  ];
  const trustOptions = [
    { value: "niedrig", label: "Niedrig" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" }
  ];

  window.OSM.registerModule({
    id: "partners",
    group: "Produktion / MRP",
    icon: "B",
    title: "Partnerbetriebe",
    description: "Externe Fertigungspartner fuer Overflow, Spezialfaelle und planbare Serien.",
    collection: "partners",
    prefix: "par",
    fields: [
      { key: "name", label: "Partnerbetrieb", required: true },
      { key: "country", label: "Land" },
      { key: "capability", label: "Faehigkeit" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "potenziell" },
      { key: "trustLevel", label: "Vertrauen", type: "select", options: trustOptions, default: "mittel" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Partner" },
      { key: "country", label: "Land" },
      { key: "capability", label: "Faehigkeit" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "trustLevel", label: "Vertrauen", render: (row, data, h) => h.badge(row.trustLevel, h.toneForStatus(row.trustLevel)) }
    ]
  });
})();
