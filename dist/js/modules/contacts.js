(function () {
  window.OSM.registerModule({
    id: "contacts",
    group: "Vertrieb & CRM",
    icon: "C",
    title: "Kontakte",
    description: "Ansprechpartner für Einkauf, Technik, Leitung und Logistik.",
    collection: "contacts",
    prefix: "con",
    fields: [
      { key: "customerId", label: "Kunde", type: "select", options: (data, h) => h.options("customers"), required: true },
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Rolle" },
      { key: "email", label: "E-Mail", type: "email" },
      { key: "phone", label: "Telefon" },
      { key: "linkedin", label: "LinkedIn", type: "url" },
      { key: "language", label: "Sprache" },
      { key: "consent", label: "Kontaktstatus" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Kontakt" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) },
      { key: "role", label: "Rolle" },
      { key: "email", label: "E-Mail" },
      { key: "phone", label: "Telefon" },
      { key: "linkedin", label: "LinkedIn" },
      { key: "language", label: "Sprache" }
    ]
  });
})();
