(function () {
  const planStatus = [
    { value: "entwurf", label: "Entwurf" },
    { value: "in pruefung", label: "In Prüfung" },
    { value: "freigegeben", label: "Freigegeben" },
    { value: "gesperrt", label: "Gesperrt" }
  ];
  const productionStatus = [
    { value: "neu", label: "Neu" },
    { value: "geplant", label: "Geplant" },
    { value: "in produktion", label: "In Produktion" },
    { value: "fertig", label: "Fertig" },
    { value: "blockiert", label: "Blockiert" },
    { value: "storniert", label: "Storniert" }
  ];
  const qualityStatus = [
    { value: "entwurf", label: "Entwurf" },
    { value: "in pruefung", label: "In Prüfung" },
    { value: "freigegeben", label: "Freigegeben" },
    { value: "gesperrt", label: "Gesperrt" },
    { value: "reklamation", label: "Reklamation" }
  ];

  function revisionOptions(data, releasedOnly) {
    return (data.partRevisions || [])
      .filter((revision) => !releasedOnly || revision.status === "freigegeben")
      .map((revision) => {
        const part = window.OSM.state.findById(data, "parts", revision.partId);
        const partLabel = part ? `${part.partNo || part.name} - ${part.name}` : revision.partId;
        return {
          value: revision.id,
          label: `${partLabel} / Rev ${revision.revision || "-"} (${revision.status || "-"})`
        };
      });
  }

  window.OSM.registerModule({
    id: "work-plans",
    group: "Produktion / MRP",
    icon: "P",
    title: "Arbeitspläne",
    description: "Arbeitsplan je Teilrevision als Brücke zwischen PDM und Fertigung.",
    collection: "workPlans",
    prefix: "wpl",
    fields: [
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo"), required: true },
      { key: "revisionId", label: "Revision", type: "select", options: (data) => revisionOptions(data, false), required: true },
      { key: "owner", label: "Verantwortlich" },
      { key: "status", label: "Status", type: "select", options: planStatus, default: "entwurf" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "owner", label: "Owner" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "work-operations",
    group: "Produktion / MRP",
    icon: "A",
    title: "Arbeitsgänge",
    description: "Einzelne Arbeitsgänge mit Maschine, Qualifikation, Rüstzeit und Zykluszeit.",
    collection: "workOperations",
    prefix: "wop",
    fields: [
      { key: "workPlanId", label: "Arbeitsplan", type: "select", options: (data, h) => h.options("workPlans"), required: true },
      { key: "stepNo", label: "Schritt", type: "number", default: 10 },
      { key: "machineId", label: "Maschine", type: "select", options: (data, h) => h.options("machines") },
      { key: "skillNeeded", label: "Qualifikation" },
      { key: "setupHours", label: "Rüstzeit h", type: "number", default: 0 },
      { key: "cycleMin", label: "Zyklus min", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: productionStatus, default: "geplant" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "workPlanId", label: "Plan", render: (row, data, h) => h.escapeHtml(h.label("workPlans", row.workPlanId)) },
      { key: "stepNo", label: "Schritt" },
      { key: "machineId", label: "Maschine", render: (row, data, h) => h.escapeHtml(h.label("machines", row.machineId)) },
      { key: "skillNeeded", label: "Qualifikation" },
      { key: "setupHours", label: "Rüst h" },
      { key: "cycleMin", label: "Zyklus min" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "machine-calendar",
    group: "Produktion / MRP",
    icon: "K",
    title: "Maschinenkalender",
    description: "Einfacher Maschinenkalender für verfuegbare und gebuchte Stunden.",
    collection: "machineCalendarEntries",
    prefix: "cal",
    fields: [
      { key: "machineId", label: "Maschine", type: "select", options: (data, h) => h.options("machines"), required: true },
      { key: "date", label: "Datum", type: "date" },
      { key: "shift", label: "Schicht", default: "1 Schicht" },
      { key: "availableHours", label: "Verfügbar h", type: "number", default: 8 },
      { key: "bookedHours", label: "Gebucht h", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: [
        { value: "verfuegbar", label: "Verfügbar" },
        { value: "geplant", label: "Geplant" },
        { value: "blockiert", label: "Blockiert" }
      ], default: "verfuegbar" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "machineId", label: "Maschine", render: (row, data, h) => h.escapeHtml(h.label("machines", row.machineId)) },
      { key: "date", label: "Datum" },
      { key: "shift", label: "Schicht" },
      { key: "availableHours", label: "Verfügbar" },
      { key: "bookedHours", label: "Gebucht" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "production-orders",
    group: "Produktion / MRP",
    icon: "F",
    title: "Produktionsaufträge",
    description: "Fertigungsaufträge mit Auftrag, Teil, freigegebener Revision, Menge und Maschine.",
    collection: "productionOrders",
    prefix: "prd",
    fields: [
      { key: "productionNo", label: "Produktionsauftrag", required: true },
      { key: "orderId", label: "Kundenauftrag", type: "select", options: (data, h) => h.options("orders", "orderNo") },
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo"), required: true },
      { key: "revisionId", label: "Freigegebene Revision", type: "select", options: (data) => revisionOptions(data, true), required: true },
      { key: "quantity", label: "Menge", type: "number", default: 1 },
      { key: "dueDate", label: "Fällig", type: "date" },
      { key: "machineId", label: "Maschine", type: "select", options: (data, h) => h.options("machines") },
      { key: "status", label: "Status", type: "select", options: productionStatus, default: "neu" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "productionNo", label: "Fertigung" },
      { key: "orderId", label: "Auftrag", render: (row, data, h) => h.escapeHtml(h.label("orders", row.orderId, "orderNo")) },
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "quantity", label: "Menge" },
      { key: "dueDate", label: "Fällig" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "operation-feedback",
    group: "Produktion / MRP",
    icon: "R",
    title: "Rückmeldungen",
    description: "Einfache Rückmeldung von Gutmenge, Ausschuss, Zeit und Mitarbeiter.",
    collection: "operationFeedback",
    prefix: "fbk",
    fields: [
      { key: "productionOrderId", label: "Produktionsauftrag", type: "select", options: (data, h) => h.options("productionOrders", "productionNo") },
      { key: "operationId", label: "Arbeitsgang", type: "select", options: (data, h) => h.options("workOperations", "stepNo") },
      { key: "employeeId", label: "Mitarbeiter", type: "select", options: (data, h) => h.options("employees") },
      { key: "goodQty", label: "Gutmenge", type: "number", default: 0 },
      { key: "scrapQty", label: "Ausschuss", type: "number", default: 0 },
      { key: "hours", label: "Stunden", type: "number", default: 0 },
      { key: "feedbackDate", label: "Datum", type: "date" },
      { key: "status", label: "Status", type: "select", options: productionStatus, default: "in produktion" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "productionOrderId", label: "Fertigung", render: (row, data, h) => h.escapeHtml(h.label("productionOrders", row.productionOrderId, "productionNo")) },
      { key: "operationId", label: "Arbeitsgang", render: (row, data, h) => h.escapeHtml(h.label("workOperations", row.operationId, "stepNo")) },
      { key: "employeeId", label: "Mitarbeiter", render: (row, data, h) => h.escapeHtml(h.label("employees", row.employeeId)) },
      { key: "goodQty", label: "Gut" },
      { key: "scrapQty", label: "Ausschuss" },
      { key: "hours", label: "h" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "inspection-plans",
    group: "Qualität",
    icon: "P",
    title: "Prüfpläne",
    description: "Prüfplan je Teilrevision. Detailmerkmale und Messmittel folgen später.",
    collection: "inspectionPlans",
    prefix: "ipl",
    fields: [
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "revisionId", label: "Revision", type: "select", options: (data) => revisionOptions(data, true) },
      { key: "responsible", label: "Verantwortlich" },
      { key: "status", label: "Status", type: "select", options: qualityStatus, default: "entwurf" },
      { key: "notes", label: "Prüfhinweise", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "responsible", label: "Verantwortlich" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "first-article",
    group: "Qualität",
    icon: "E",
    title: "Erstteilfreigabe",
    description: "Erstteilfreigabe vor Serienfertigung oder Wiederholauftrag.",
    collection: "firstArticleApprovals",
    prefix: "faa",
    fields: [
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "revisionId", label: "Revision", type: "select", options: (data) => revisionOptions(data, true) },
      { key: "productionOrderId", label: "Produktionsauftrag", type: "select", options: (data, h) => h.options("productionOrders", "productionNo") },
      { key: "approvedBy", label: "Freigegeben von" },
      { key: "approvedDate", label: "Datum", type: "date" },
      { key: "status", label: "Status", type: "select", options: qualityStatus, default: "in pruefung" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "revisionId", label: "Rev", render: (row, data, h) => h.escapeHtml(h.label("partRevisions", row.revisionId, "revision")) },
      { key: "productionOrderId", label: "Fertigung", render: (row, data, h) => h.escapeHtml(h.label("productionOrders", row.productionOrderId, "productionNo")) },
      { key: "approvedBy", label: "Von" },
      { key: "approvedDate", label: "Datum" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "inspection-reports",
    group: "Qualität",
    icon: "Q",
    title: "Prüfprotokolle",
    description: "Prüfberichte für Fertigungsauftrag, Teil und Ergebnis.",
    collection: "inspectionReports",
    prefix: "irp",
    fields: [
      { key: "productionOrderId", label: "Produktionsauftrag", type: "select", options: (data, h) => h.options("productionOrders", "productionNo") },
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "inspectorId", label: "Prüfer", type: "select", options: (data, h) => h.options("employees") },
      { key: "reportDate", label: "Datum", type: "date" },
      { key: "result", label: "Ergebnis" },
      { key: "status", label: "Status", type: "select", options: qualityStatus, default: "in pruefung" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "productionOrderId", label: "Fertigung", render: (row, data, h) => h.escapeHtml(h.label("productionOrders", row.productionOrderId, "productionNo")) },
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "inspectorId", label: "Prüfer", render: (row, data, h) => h.escapeHtml(h.label("employees", row.inspectorId)) },
      { key: "reportDate", label: "Datum" },
      { key: "result", label: "Ergebnis" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "complaints",
    group: "Qualität",
    icon: "K",
    title: "Reklamationen",
    description: "Kunden- und Lieferantenreklamationen mit Ursache, Status und Massnahmen.",
    collection: "complaints",
    prefix: "cmp",
    fields: [
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers") },
      { key: "orderId", label: "Auftrag", type: "select", options: (data, h) => h.options("orders", "orderNo") },
      { key: "openedDate", label: "Eroeffnet", type: "date" },
      { key: "reason", label: "Grund", required: true },
      { key: "owner", label: "Verantwortlich" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "offen", label: "Offen" },
        { value: "in arbeit", label: "In Arbeit" },
        { value: "abgeschlossen", label: "Abgeschlossen" },
        { value: "kritisch", label: "Kritisch" }
      ], default: "offen" },
      { key: "notes", label: "Massnahmen / Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "orderId", label: "Auftrag", render: (row, data, h) => h.escapeHtml(h.label("orders", row.orderId, "orderNo")) },
      { key: "openedDate", label: "Datum" },
      { key: "reason", label: "Grund" },
      { key: "owner", label: "Owner" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
