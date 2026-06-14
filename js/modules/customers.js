(function () {
  const statusOptions = [
    { value: "lead", label: "Lead" },
    { value: "aktiv", label: "Aktiv" },
    { value: "ruhend", label: "Ruhend" },
    { value: "intern", label: "Intern" }
  ];

  window.OSM.registerModule({
    id: "customers",
    group: "CRM",
    icon: "K",
    title: "Kunden",
    description: "Firmen, Zielkunden und interne Organisationen.",
    collection: "customers",
    prefix: "cus",
    fields: [
      { key: "name", label: "Firmenname", required: true },
      { key: "country", label: "Land" },
      { key: "industry", label: "Branche" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "lead" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Kunde" },
      { key: "country", label: "Land" },
      { key: "industry", label: "Branche" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "notes", label: "Notiz" }
    ]
  });
})();
