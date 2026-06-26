(function () {
  function count(collection, label, filter) {
    return {
      label,
      value(data) {
        const rows = data[collection] || [];
        return filter ? rows.filter(filter).length : rows.length;
      }
    };
  }

  const areas = [
    {
      id: "management",
      title: "Management",
      description: "Projekte, Aufgaben und Führungsüberblick.",
      modules: ["projects", "tasks"],
      related: ["sales", "production", "finance"],
      metrics: [
        count("projects", "Aktive Projekte", (item) => item.status !== "abgeschlossen"),
        count("tasks", "Offene Aufgaben", (item) => item.status !== "erledigt")
      ]
    },
    {
      id: "sales",
      title: "Vertrieb & CRM",
      description: "Kunden, Kontakte, RFQs, Angebotsrechner, Angebote und Aufträge.",
      modules: ["customers", "contacts", "rfqs", "offer-calculator", "quotes", "orders"],
      related: ["pdm", "production", "logistics", "finance"],
      metrics: [
        count("customers", "Kunden"),
        count("rfqs", "Offene RFQs", (item) => !["abgelehnt", "gewonnen"].includes(item.status)),
        count("quotes", "Angebote"),
        count("orders", "Offene Aufträge", (item) => item.status !== "geliefert")
      ]
    },
    {
      id: "pdm",
      title: "PDM / Konstruktion",
      description: "Teile, Zeichnungen, STEP, Revisionen, Freigaben und Änderungen.",
      modules: ["parts", "part-revisions", "files", "bom-items", "change-requests"],
      related: ["sales", "production", "quality", "inventory"],
      metrics: [
        count("parts", "Teile"),
        count("partRevisions", "Freigegeben", (item) => item.status === "freigegeben"),
        count("partRevisions", "Zu prüfen", (item) => item.status !== "freigegeben"),
        count("changeRequests", "Änderungen offen", (item) => !["abgeschlossen", "abgelehnt"].includes(item.status))
      ]
    },
    {
      id: "procurement",
      title: "Einkauf",
      description: "Lieferanten, Materialbedarf, Bestellungen und Wareneingang.",
      modules: ["suppliers", "purchase-requests", "purchase-orders", "goods-receipts"],
      related: ["inventory", "production", "pdm", "finance"],
      metrics: [
        count("suppliers", "Lieferanten"),
        count("purchaseRequests", "Bedarf offen", (item) => !["erhalten", "storniert"].includes(item.status)),
        count("purchaseOrders", "Bestellungen offen", (item) => !["erhalten", "storniert"].includes(item.status)),
        count("goodsReceipts", "Wareneingänge")
      ]
    },
    {
      id: "inventory",
      title: "Lager",
      description: "Lagerorte, Bestand, Bewegungen, Reservierungen und Mindestbestand.",
      modules: ["warehouse-locations", "stock-items", "stock-movements", "reservations"],
      related: ["procurement", "production", "logistics", "pdm"],
      metrics: [
        count("warehouseLocations", "Lagerorte"),
        count("stockItems", "Bestandspositionen"),
        count("stockItems", "Materialmangel", (item) => item.status === "mangel"),
        count("reservations", "Reservierungen offen", (item) => item.status !== "erledigt")
      ]
    },
    {
      id: "production",
      title: "Produktion / MRP",
      description: "Kapazität, Maschinen, Partner, Arbeitspläne und Fertigungsaufträge.",
      modules: ["capacity", "machines", "partners", "work-plans", "work-operations", "machine-calendar", "production-orders", "operation-feedback"],
      related: ["sales", "pdm", "inventory", "quality", "people"],
      metrics: [
        count("machines", "Maschinen"),
        count("productionOrders", "Fertigungsaufträge offen", (item) => !["fertig", "storniert"].includes(item.status)),
        count("workPlans", "Arbeitspläne"),
        count("machineCalendarEntries", "Kalendereintraege")
      ]
    },
    {
      id: "quality",
      title: "Qualität",
      description: "Prüfpläne, Erstteilfreigabe, Prüfprotokolle und Reklamationen.",
      modules: ["inspection-plans", "first-article", "inspection-reports", "complaints"],
      related: ["pdm", "production", "sales"],
      metrics: [
        count("inspectionPlans", "Prüfpläne"),
        count("firstArticleApprovals", "Erstteile offen", (item) => item.status !== "freigegeben"),
        count("inspectionReports", "Prüfprotokolle"),
        count("complaints", "Reklamationen offen", (item) => item.status !== "abgeschlossen")
      ]
    },
    {
      id: "logistics",
      title: "Logistik",
      description: "Lieferstatus, Packliste, DAXA-Referenz, Tracking und Versand.",
      modules: ["deliveries"],
      related: ["sales", "inventory", "finance", "quality"],
      metrics: [
        count("deliveries", "Sendungen"),
        count("deliveries", "Offen", (item) => !["geliefert"].includes(item.status)),
        count("deliveries", "Probleme", (item) => item.status === "problem")
      ]
    },
    {
      id: "people",
      title: "Personal",
      description: "Mitarbeiter, Qualifikationen, Schichten, Verfügbarkeit und Abwesenheit.",
      modules: ["employees", "employee-skills", "shifts", "absences"],
      related: ["production", "quality", "management"],
      metrics: [
        count("employees", "Mitarbeiter aktiv", (item) => item.status === "aktiv"),
        count("employeeSkills", "Qualifikationen"),
        count("shifts", "Schichten geplant", (item) => item.status === "geplant"),
        count("absences", "Abwesenheiten")
      ]
    },
    {
      id: "finance",
      title: "Finanzen",
      description: "Kostenstellen, Rechnungsgrundlagen, Zahlungen, offene Posten und Sperrhinweis.",
      modules: ["cost-centers", "invoices", "credit-notes", "payments", "open-items", "finance-postings"],
      related: ["sales", "procurement", "logistics", "management"],
      metrics: [
        count("invoices", "Rechnungen"),
        count("openItems", "Offene Posten", (item) => item.status !== "bezahlt"),
        count("payments", "Zahlungen"),
        count("financePostings", "Gesperrte Finanzlogik", (item) => item.status === "commercialista offen")
      ]
    },
    {
      id: "system",
      title: "System & Rechte",
      description: "Gesellschaft, Rollen, Historie, Nummernkreise, Sicherheit und Backups.",
      modules: ["companies", "roles", "security", "number-ranges", "audit-log", "settings"],
      related: ["management", "finance"],
      metrics: [
        count("companies", "Gesellschaften"),
        count("roles", "Rollen"),
        count("numberRanges", "Nummernkreise"),
        count("auditLogs", "Historie")
      ]
    },
    {
      id: "masterdata",
      title: "Stammdaten",
      description: "Materialgruppen und weitere Grunddaten.",
      modules: ["materials"],
      related: ["sales", "procurement", "inventory", "production"],
      metrics: [
        count("materials", "Materialgruppen")
      ]
    }
  ];

  function findArea(id) {
    return areas.find((area) => area.id === id);
  }

  function findAreaForModule(moduleId) {
    return areas.find((area) => area.modules.includes(moduleId));
  }

  function moduleById(moduleId) {
    return (window.OSM.modules || []).find((module) => module.id === moduleId);
  }

  function areaMetrics(area, data) {
    return (area.metrics || []).map((metric) => ({
      label: metric.label,
      value: metric.value(data)
    }));
  }

  function recordTitle(record) {
    return record.name || record.title || record.partName || record.partNo || record.quoteNo ||
      record.orderNo || record.productionNo || record.invoiceNo || record.documentNo ||
      record.code || record.reason || record.id;
  }

  function recordMeta(record) {
    return [record.status, record.dueDate || record.needDate || record.expectedDate || record.date || record.invoiceDate]
      .filter(Boolean)
      .join(" / ");
  }

  function importantRows(area, data) {
    const rows = [];
    (area.modules || []).forEach((moduleId) => {
      const module = moduleById(moduleId);
      if (!module || !module.collection) return;
      const items = data[module.collection] || [];
      items.forEach((item) => {
        const status = String(item.status || "").toLowerCase();
        const isRelevant = !status || ![
          "erledigt", "geliefert", "bezahlt", "abgeschlossen", "storniert", "archiv"
        ].includes(status);
        if (!isRelevant) return;
        rows.push({
          moduleId,
          moduleTitle: module.title,
          title: recordTitle(item),
          meta: recordMeta(item)
        });
      });
    });
    return rows.slice(0, 8);
  }

  window.OSM_AREAS = areas;
  window.OSM_AREA_TOOLS = {
    findArea,
    findAreaForModule,
    moduleById,
    areaMetrics,
    importantRows
  };
})();
