(function () {
  const statusOptions = [
    { value: "offen", label: "Offen" },
    { value: "in arbeit", label: "In Arbeit" },
    { value: "wartet", label: "Wartet" },
    { value: "erledigt", label: "Erledigt" }
  ];
  const priorityOptions = [
    { value: "niedrig", label: "Niedrig" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" }
  ];

  window.OSM.registerModule({
    id: "tasks",
    group: "Management",
    icon: "T",
    title: "Aufgaben",
    description: "Aufgaben für Management, Vertrieb, Produktion und Prozessverbesserung.",
    collection: "tasks",
    prefix: "tsk",
    fields: [
      { key: "title", label: "Aufgabe", required: true },
      { key: "projectId", label: "Projekt", type: "select", options: (data, h) => h.options("projects") },
      { key: "area", label: "Bereich" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "offen" },
      { key: "priority", label: "Prioritaet", type: "select", options: priorityOptions, default: "mittel" },
      { key: "owner", label: "Verantwortlich" },
      { key: "dueDate", label: "Fällig am", type: "date" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "title", label: "Aufgabe" },
      { key: "projectId", label: "Projekt", render: (row, data, h) => h.escapeHtml(h.label("projects", row.projectId, "name")) },
      { key: "area", label: "Bereich" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "priority", label: "Prioritaet", render: (row, data, h) => h.badge(row.priority, h.toneForStatus(row.priority)) },
      { key: "dueDate", label: "Fällig" }
    ]
  });
})();
