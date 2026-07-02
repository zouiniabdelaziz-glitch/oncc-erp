(function () {
  const simpleStatus = [
    { value: "aktiv", label: "Aktiv" },
    { value: "potenziell", label: "Potenziell" },
    { value: "in pruefung", label: "In Prüfung" },
    { value: "gesperrt", label: "Gesperrt" }
  ];
  const requestStatus = [
    { value: "offen", label: "Offen" },
    { value: "angefragt", label: "Angefragt" },
    { value: "bestellt", label: "Bestellt" },
    { value: "erhalten", label: "Erhalten" },
    { value: "storniert", label: "Storniert" }
  ];
  const orderStatus = [
    { value: "entwurf", label: "Entwurf" },
    { value: "bestellt", label: "Bestellt" },
    { value: "teilgeliefert", label: "Teilgeliefert" },
    { value: "erhalten", label: "Erhalten" },
    { value: "storniert", label: "Storniert" }
  ];
  const stockStatus = [
    { value: "verfuegbar", label: "Verfügbar" },
    { value: "reserviert", label: "Reserviert" },
    { value: "mangel", label: "Mangel" },
    { value: "gesperrt", label: "Gesperrt" }
  ];

  window.OSM.registerModule({
    id: "suppliers",
    group: "Einkauf",
    icon: "L",
    title: "Lieferanten",
    description: "Lieferanten für Material, externe Bearbeitung und Dienstleistungen.",
    collection: "suppliers",
    prefix: "sup",
    fields: [
      { key: "name", label: "Lieferant", required: true },
      { key: "country", label: "Land" },
      { key: "category", label: "Kategorie" },
      { key: "contact", label: "Kontakt" },
      { key: "status", label: "Status", type: "select", options: simpleStatus, default: "potenziell" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Lieferant" },
      { key: "country", label: "Land" },
      { key: "category", label: "Kategorie" },
      { key: "contact", label: "Kontakt" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "purchase-requests",
    group: "Einkauf",
    icon: "M",
    title: "Materialbedarf",
    description: "Bedarf aus RFQ, Auftrag, Produktionsauftrag oder Lager-Mindestbestand.",
    collection: "purchaseRequests",
    prefix: "preq",
    fields: [
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "orderId", label: "Auftrag", type: "select", options: (data, h) => h.options("orders", "orderNo") },
      { key: "quantity", label: "Menge", type: "number", default: 1 },
      { key: "unit", label: "Einheit", default: "Stk" },
      { key: "needDate", label: "Bedarf bis", type: "date" },
      { key: "status", label: "Status", type: "select", options: requestStatus, default: "offen" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "quantity", label: "Menge" },
      { key: "unit", label: "Einheit" },
      { key: "needDate", label: "Bedarf" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "purchase-orders",
    group: "Einkauf",
    icon: "B",
    title: "Bestellungen",
    description: "Einfache Einkaufsbestellungen für Material und externe Leistungen.",
    collection: "purchaseOrders",
    prefix: "po",
    fields: [
      { key: "orderNo", label: "Bestellnummer", required: true },
      { key: "supplierId", label: "Lieferant", type: "select", options: (data, h) => h.options("suppliers"), required: true },
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "orderDate", label: "Bestelldatum", type: "date" },
      { key: "expectedDate", label: "Erwartet", type: "date" },
      { key: "totalValue", label: "Wert EUR", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: orderStatus, default: "entwurf" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "orderNo", label: "Bestellung" },
      { key: "supplierId", label: "Lieferant", render: (row, data, h) => h.escapeHtml(h.label("suppliers", row.supplierId)) },
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "expectedDate", label: "Erwartet" },
      { key: "totalValue", label: "Wert", render: (row) => row.totalValue ? `${Number(row.totalValue).toLocaleString("de-DE")} EUR` : "-" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "goods-receipts",
    group: "Einkauf",
    icon: "W",
    title: "Wareneingang",
    description: "Wareneingang für Material, Einkauf und spätere Lagerbuchung.",
    collection: "goodsReceipts",
    prefix: "gr",
    fields: [
      { key: "purchaseOrderId", label: "Bestellung", type: "select", options: (data, h) => h.options("purchaseOrders", "orderNo") },
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "quantity", label: "Menge", type: "number", default: 1 },
      { key: "unit", label: "Einheit", default: "Stk" },
      { key: "receivedDate", label: "Eingang", type: "date" },
      { key: "locationId", label: "Lagerort", type: "select", options: (data, h) => h.options("warehouseLocations", "code") },
      { key: "status", label: "Status", type: "select", options: orderStatus, default: "erhalten" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "purchaseOrderId", label: "Bestellung", render: (row, data, h) => h.escapeHtml(h.label("purchaseOrders", row.purchaseOrderId, "orderNo")) },
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "quantity", label: "Menge" },
      { key: "unit", label: "Einheit" },
      { key: "receivedDate", label: "Eingang" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "warehouse-locations",
    group: "Lager",
    icon: "O",
    title: "Lagerorte",
    description: "Einfache Lagerorte für Rohmaterial, Fertigteile, Sperrlager und Versand.",
    collection: "warehouseLocations",
    prefix: "loc",
    fields: [
      { key: "code", label: "Code", required: true },
      { key: "name", label: "Name", required: true },
      { key: "type", label: "Typ" },
      { key: "status", label: "Status", type: "select", options: simpleStatus, default: "aktiv" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Lagerort" },
      { key: "type", label: "Typ" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "stock-items",
    group: "Lager",
    icon: "S",
    title: "Bestand",
    description: "Aktueller Bestand je Material/Teil und Lagerort. V1 bewusst ohne Chargen und Zeugnisse.",
    collection: "stockItems",
    prefix: "stk",
    fields: [
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "locationId", label: "Lagerort", type: "select", options: (data, h) => h.options("warehouseLocations", "code") },
      { key: "quantity", label: "Bestand", type: "number", default: 0 },
      { key: "unit", label: "Einheit", default: "Stk" },
      { key: "minQuantity", label: "Mindestbestand", type: "number", default: 0 },
      { key: "status", label: "Status", type: "select", options: stockStatus, default: "verfuegbar" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "partId", label: "Teil", render: (row, data, h) => h.escapeHtml(h.label("parts", row.partId, "partNo")) },
      { key: "locationId", label: "Ort", render: (row, data, h) => h.escapeHtml(h.label("warehouseLocations", row.locationId, "code")) },
      { key: "quantity", label: "Bestand" },
      { key: "minQuantity", label: "Min." },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "stock-movements",
    group: "Lager",
    icon: "V",
    title: "Bewegungen",
    description: "Nachvollziehbare Lagerbewegungen mit Benutzer, Zeit und Richtung.",
    collection: "stockMovements",
    prefix: "mov",
    fields: [
      { key: "movementType", label: "Bewegungstyp", required: true },
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "fromLocationId", label: "Von Lagerort", type: "select", options: (data, h) => h.options("warehouseLocations", "code") },
      { key: "toLocationId", label: "Nach Lagerort", type: "select", options: (data, h) => h.options("warehouseLocations", "code") },
      { key: "quantity", label: "Menge", type: "number", default: 1 },
      { key: "unit", label: "Einheit", default: "Stk" },
      { key: "movementDate", label: "Datum", type: "date" },
      { key: "user", label: "Benutzer", default: "OS.MECHPLAST" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "entwurf", label: "Entwurf" },
        { value: "gebucht", label: "Gebucht" },
        { value: "storniert", label: "Storniert" }
      ], default: "gebucht" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "movementType", label: "Typ" },
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "fromLocationId", label: "Von", render: (row, data, h) => h.escapeHtml(h.label("warehouseLocations", row.fromLocationId, "code")) },
      { key: "toLocationId", label: "Nach", render: (row, data, h) => h.escapeHtml(h.label("warehouseLocations", row.toLocationId, "code")) },
      { key: "quantity", label: "Menge" },
      { key: "movementDate", label: "Datum" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });

  window.OSM.registerModule({
    id: "reservations",
    group: "Lager",
    icon: "R",
    title: "Reservierungen",
    description: "Material- oder Teile-Reservierungen für Auftrag und Produktionsauftrag.",
    collection: "reservations",
    prefix: "res",
    fields: [
      { key: "orderId", label: "Auftrag", type: "select", options: (data, h) => h.options("orders", "orderNo") },
      { key: "productionOrderId", label: "Produktionsauftrag", type: "select", options: (data, h) => h.options("productionOrders", "productionNo") },
      { key: "materialGroupId", label: "Materialgruppe", type: "select", options: (data, h) => h.options("materials") },
      { key: "partId", label: "Teil", type: "select", options: (data, h) => h.options("parts", "partNo") },
      { key: "quantity", label: "Menge", type: "number", default: 1 },
      { key: "unit", label: "Einheit", default: "Stk" },
      { key: "needDate", label: "Bedarf", type: "date" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "offen", label: "Offen" },
        { value: "reserviert", label: "Reserviert" },
        { value: "mangel", label: "Mangel" },
        { value: "erledigt", label: "Erledigt" }
      ], default: "offen" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "orderId", label: "Auftrag", render: (row, data, h) => h.escapeHtml(h.label("orders", row.orderId, "orderNo")) },
      { key: "productionOrderId", label: "Fertigung", render: (row, data, h) => h.escapeHtml(h.label("productionOrders", row.productionOrderId, "productionNo")) },
      { key: "materialGroupId", label: "Material", render: (row, data, h) => h.escapeHtml(h.label("materials", row.materialGroupId)) },
      { key: "quantity", label: "Menge" },
      { key: "needDate", label: "Bedarf" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ]
  });
})();
