(function () {
  const partStatus = [
    { value: "aktiv", label: "Aktiv" },
    { value: "in pruefung", label: "In Pruefung" },
    { value: "gesperrt", label: "Gesperrt" },
    { value: "archiv", label: "Archiv" }
  ];
  const revisionStatus = [
    { value: "entwurf", label: "Entwurf" },
    { value: "in pruefung", label: "In Pruefung" },
    { value: "freigegeben", label: "Freigegeben" },
    { value: "gesperrt", label: "Gesperrt" }
  ];
  const changeStatus = [
    { value: "offen", label: "Offen" },
    { value: "in arbeit", label: "In Arbeit" },
    { value: "genehmigt", label: "Genehmigt" },
    { value: "abgelehnt", label: "Abgelehnt" },
    { value: "abgeschlossen", label: "Abgeschlossen" }
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
    id: "parts",
    group: "PDM / Konstruktion",
    icon: "T",
    title: "Teile",
    description: "Teilstamm als PDM-Kern: Kunde, Teileart, Status und aktuelle Revision.",
    collection: "parts",
    prefix: "prt",
    fields: [
      { key: "partNo", label: "Teilenummer", required: true },
      { key: "name", label: "Bezeichnung", required: true },
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers") },
      { key: "partType", label: "Teiletyp" },
      { key: "currentRevisionId", label: "Aktuelle Revision", type: "select", options: revisionOptions },
      { key: "status", label: "Status", type: "select", options: partStatus, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partNo", label: "Teilenr." },
      { key: "name", label: "Teil" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "partType", label: "Typ" },
      { key: "currentRevisionId", label: "Revision", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.currentRevisionId, "revision")) },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "part-revisions",
    group: "PDM / Konstruktion",
    icon: "V",
    title: "Teilrevisionen",
    description: "Zeichnung, STEP-Referenz und Freigabestatus je Teilrevision.",
    collection: "partRevisions",
    prefix: "rev",
    fields: [
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo"), required: true },
      { key: "revision", label: "Revision", required: true },
      { key: "status", label: "Status", type: "select", options: revisionStatus, default: "entwurf" },
      { key: "releaseDate", label: "Freigabedatum", type: "date" },
      { key: "releasedBy", label: "Freigegeben von" },
      { key: "drawingRef", label: "Zeichnung / PDF" },
      { key: "stepRef", label: "STEP / 3D" },
      { key: "notes", label: "Freigabehinweise", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revision", label: "Rev" },
      { key: "status", label: "Freigabe", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "drawingRef", label: "PDF" },
      { key: "stepRef", label: "STEP" },
      { key: "releaseDate", label: "Datum" },
      { key: "releasedBy", label: "Von" }
    ]
  });

  window.OSM.registerModule({
    id: "bom-items",
    group: "PDM / Konstruktion",
    icon: "B",
    title: "Stueckliste",
    description: "Einfache Stuecklisten- und Materialpositionen. Varianten und echte BOM-Logik folgen spaeter.",
    collection: "bomItems",
    prefix: "bom",
    fields: [
      { key: "parentPartId", label: "Hauptteil", type: "select", options: (data, h) => h.options("parts", "partNo"), required: true },
      { key: "childPartId", label: "Unterteil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "quantity", label: "Menge", type: "number", default: 1 },
      { key: "unit", label: "Einheit", default: "Stk" },
      { key: "status", label: "Status", type: "select", options: partStatus, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "parentPartId", label: "Hauptteil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.parentPartId, "partNo")) },
      { key: "childPartId", label: "Unterteil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.childPartId, "partNo")) },
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "quantity", label: "Menge" },
      { key: "unit", label: "Einheit" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "change-requests",
    group: "PDM / Konstruktion",
    icon: "C",
    title: "Aenderungen",
    description: "Aenderungsantraege fuer Zeichnungen, Revisionen, Varianten und technische Freigaben.",
    collection: "changeRequests",
    prefix: "chg",
    fields: [
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "revisionId", label: "Revision", type: "select", options: revisionOptions },
      { key: "reason", label: "Grund", required: true },
      { key: "owner", label: "Verantwortlich" },
      { key: "priority", label: "Prioritaet", type: "select", options: [
        { value: "niedrig", label: "Niedrig" },
        { value: "mittel", label: "Mittel" },
        { value: "hoch", label: "Hoch" }
      ], default: "mittel" },
      { key: "dueDate", label: "Faellig", type: "date" },
      { key: "status", label: "Status", type: "select", options: changeStatus, default: "offen" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "reason", label: "Grund" },
      { key: "owner", label: "Owner" },
      { key: "priority", label: "Prio", render: (row, data, h) => h.badge(row.priority, h.toneForStatus(row.priority)) },
      { key: "dueDate", label: "Faellig" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
