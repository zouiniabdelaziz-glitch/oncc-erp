(function () {
  const moduleOptions = [
    { value: "RFQ", label: "RFQ" },
    { value: "Angebot", label: "Angebot" },
    { value: "Auftrag", label: "Auftrag" },
    { value: "Projekt", label: "Projekt" },
    { value: "Kunde", label: "Kunde" }
  ];
  const typeOptions = [
    { value: "PDF", label: "PDF" },
    { value: "STEP", label: "STEP" },
    { value: "DXF", label: "DXF" },
    { value: "Bild", label: "Bild" },
    { value: "Sonstiges", label: "Sonstiges" }
  ];

  window.OSM.registerModule({
    id: "files",
    group: "Sales / RFQ",
    icon: "F",
    title: "Dateien / Zeichnungen",
    description: "Referenzen auf Zeichnungen, PDFs, STEP-Dateien und Angebotsunterlagen.",
    collection: "files",
    prefix: "fil",
    fields: [
      { key: "title", label: "Titel", required: true },
      { key: "linkedModule", label: "Verbunden mit", type: "select", options: moduleOptions },
      { key: "linkedId", label: "ID / Referenz" },
      { key: "fileType", label: "Dateityp", type: "select", options: typeOptions },
      { key: "path", label: "Dateiname oder Pfad" },
      { key: "version", label: "Version" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "title", label: "Datei" },
      { key: "linkedModule", label: "Modul" },
      { key: "linkedId", label: "Referenz" },
      { key: "fileType", label: "Typ", render: (row, data, h) => h.badge(row.fileType, "muted") },
      { key: "path", label: "Pfad / Name" },
      { key: "version", label: "Version" }
    ]
  });
})();
