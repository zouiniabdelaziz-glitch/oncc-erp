(function () {
  const statusOptions = [
    { value: "aktiv", label: "Aktiv" },
    { value: "wartung", label: "Wartung" },
    { value: "inaktiv", label: "Inaktiv" }
  ];
  const shiftOptions = [
    { value: "1 Schicht", label: "1 Schicht" },
    { value: "2 Schichten moeglich", label: "2 Schichten moeglich" },
    { value: "3 Schichten moeglich", label: "3 Schichten moeglich" }
  ];

  window.OSM.registerModule({
    id: "machines",
    group: "Produktion / MRP",
    icon: "M",
    title: "Maschinen",
    description: "Maschinen, Faehigkeiten und grobes Schichtmodell.",
    collection: "machines",
    prefix: "mac",
    fields: [
      { key: "name", label: "Maschine", required: true },
      { key: "type", label: "Typ" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "aktiv" },
      { key: "shiftModel", label: "Schichtmodell", type: "select", options: shiftOptions, default: "1 Schicht" },
      { key: "capabilities", label: "Faehigkeiten", type: "textarea", wide: true },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Maschine" },
      { key: "type", label: "Typ" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "shiftModel", label: "Schicht" },
      { key: "capabilities", label: "Faehigkeiten" }
    ]
  });
})();
