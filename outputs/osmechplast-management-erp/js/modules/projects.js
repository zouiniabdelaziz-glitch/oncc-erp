(function () {
  const statusOptions = [
    { value: "idee", label: "Idee" },
    { value: "aktiv", label: "Aktiv" },
    { value: "wartet", label: "Wartet" },
    { value: "abgeschlossen", label: "Abgeschlossen" }
  ];
  const priorityOptions = [
    { value: "niedrig", label: "Niedrig" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" }
  ];

  window.OSM.registerModule({
    id: "projects",
    group: "Management",
    icon: "P",
    title: "Projekte",
    description: "Interne und kundenbezogene Projekte klein halten, sichtbar machen und steuern.",
    collection: "projects",
    prefix: "pro",
    fields: [
      { key: "name", label: "Projektname", required: true },
      { key: "customerId", label: "Kunde / intern", type: "select", options: (data, h) => h.options("customers") },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "aktiv" },
      { key: "priority", label: "Prioritaet", type: "select", options: priorityOptions, default: "mittel" },
      { key: "owner", label: "Verantwortlich" },
      { key: "dueDate", label: "Fällig am", type: "date" },
      { key: "progress", label: "Fortschritt %", type: "number", default: 0 },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Projekt" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "priority", label: "Prioritaet", render: (row, data, h) => h.badge(row.priority, h.toneForStatus(row.priority)) },
      { key: "dueDate", label: "Fällig" },
      { key: "progress", label: "Fortschritt", render: (row) => `${Number(row.progress || 0)}%` }
    ]
  });
})();
