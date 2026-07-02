(function () {
  const statusOptions = [
    { value: "offen", label: "Offen" },
    { value: "bereit", label: "Bereit" },
    { value: "versendet", label: "Versendet" },
    { value: "geliefert", label: "Geliefert" },
    { value: "problem", label: "Problem" }
  ];

  window.OSM.registerModule({
    id: "deliveries",
    group: "Logistik",
    icon: "L",
    title: "Lieferstatus",
    description: "Einfacher Versand- und Lieferstatus, später mit DAXA-Referenzen erweiterbar.",
    collection: "deliveries",
    prefix: "del",
    fields: [
      { key: "orderId", label: "Auftrag", type: "select", options: (data, h) => h.options("orders", "orderNo"), required: true },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "offen" },
      { key: "packListNo", label: "Packliste" },
      { key: "carrier", label: "Transporteur", default: "DAXA" },
      { key: "daxaRef", label: "DAXA-Referenz" },
      { key: "tracking", label: "Tracking / Referenz" },
      { key: "shipDate", label: "Versanddatum", type: "date" },
      { key: "deliveredDate", label: "Geliefert am", type: "date" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "orderId", label: "Auftrag", render: (row, data, h) => h.escapeHtml(h.label("orders", row.orderId, "orderNo")) },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "packListNo", label: "Packliste" },
      { key: "carrier", label: "Transporteur" },
      { key: "daxaRef", label: "DAXA" },
      { key: "tracking", label: "Tracking" },
      { key: "shipDate", label: "Versand" },
      { key: "deliveredDate", label: "Geliefert" }
    ]
  });
})();
