(function () {
  const STORAGE_KEY = "osmechplast.management.erp.v1";

  const seedData = {
    customers: [
      {
        id: "cus_muster_at",
        name: "Muster Maschinenbau GmbH",
        country: "AT",
        industry: "Sondermaschinenbau",
        status: "aktiv",
        notes: "Guter Zielkunde für wiederkehrende Drehteile."
      },
      {
        id: "cus_internal",
        name: "OS.MECHPLAST intern",
        country: "IT",
        industry: "CNC-Lohnfertigung",
        status: "intern",
        notes: "Interne Projekte, Aufgaben und Prozessverbesserungen."
      }
    ],
    contacts: [
      {
        id: "con_anna_einkauf",
        customerId: "cus_muster_at",
        name: "Anna Einkauf",
        role: "Einkauf",
        email: "anna.einkauf@example.com",
        phone: "",
        language: "DE",
        consent: "Kontakt vorhanden",
        notes: "Reagiert auf Termintreue und schnelle Rückmeldung."
      }
    ],
    projects: [
      {
        id: "pro_erp_v1",
        name: "ERP/MRP V1 Aufbau",
        customerId: "cus_internal",
        status: "aktiv",
        priority: "hoch",
        owner: "OS.MECHPLAST",
        dueDate: "2026-07-15",
        progress: 15,
        notes: "Kleines lokales Management-ERP mit RFQ, Angebot, Auftrag und Kapazität."
      }
    ],
    tasks: [
      {
        id: "tsk_rules",
        title: "Kapazitätsregeln mit echten Erfahrungswerten prüfen",
        projectId: "pro_erp_v1",
        area: "MRP",
        status: "offen",
        priority: "hoch",
        owner: "Leitung",
        dueDate: "2026-06-24",
        notes: "Rüstzeit, Materialrisiko und realistische Lieferzeit je Teilefamilie ergaenzen."
      },
      {
        id: "tsk_rfq_template",
        title: "RFQ-Pflichtfelder finalisieren",
        projectId: "pro_erp_v1",
        area: "Sales",
        status: "in arbeit",
        priority: "mittel",
        owner: "Vertrieb",
        dueDate: "2026-06-20",
        notes: "Material, Menge, Zeichnung, Terminwunsch, Toleranz und Besonderheiten."
      }
    ],
    rfqs: [
      {
        id: "rfq_1001",
        customerId: "cus_muster_at",
        contactId: "con_anna_einkauf",
        partId: "prt_adapterwelle",
        revisionId: "rev_adapterwelle_a",
        partName: "Aluminium Adapterwelle",
        partType: "dreh-fraes",
        materialGroupId: "mat_aluminium",
        quantity: 120,
        dueDate: "2026-07-10",
        complexity: "mittel",
        tolerance: "normal",
        status: "neu",
        fileRef: "adapterwelle_revA.pdf",
        notes: "Y-Achse wahrscheinlich sinnvoll. Wiederkehrender Bedarf möglich."
      }
    ],
    files: [
      {
        id: "fil_adapter",
        title: "Adapterwelle Zeichnung Rev A",
        linkedModule: "RFQ",
        linkedId: "rfq_1001",
        partId: "prt_adapterwelle",
        revisionId: "rev_adapterwelle_a",
        fileType: "PDF",
        path: "adapterwelle_revA.pdf",
        version: "A",
        notes: "In V1 als Referenzpfad, später echte Dateiablage in der App."
      }
    ],
    quotes: [
      {
        id: "quo_1001",
        rfqId: "rfq_1001",
        partId: "prt_adapterwelle",
        revisionId: "rev_adapterwelle_a",
        quoteNo: "ANG-2026-001",
        status: "entwurf",
        validUntil: "2026-07-01",
        leadTime: "ca. 15-20 Arbeitstage",
        priceStatus: "offen",
        risk: "mittel",
        decision: "pruefen",
        notes: "Material- und Kapazitätsfenster vor Versand bestätigen."
      }
    ],
    orders: [],
    deliveries: [],
    machines: [
      {
        id: "mac_l210_a",
        name: "Hyundai WIA L210LMA #1",
        type: "CNC-Drehzentrum",
        status: "aktiv",
        shiftModel: "1 Schicht",
        capabilities: "Drehteile, Prototypen, Kleinserien, mittlere Serien",
        notes: "Standardmaschine für einfache bis mittlere Drehteile."
      },
      {
        id: "mac_l210_b",
        name: "Hyundai WIA L210LMA #2",
        type: "CNC-Drehzentrum",
        status: "aktiv",
        shiftModel: "1 Schicht",
        capabilities: "Drehteile, Serienwiederholung, Entlastung",
        notes: "Parallelmaschine für Wiederholteile und Kapazität."
      },
      {
        id: "mac_hd2200sy",
        name: "Hyundai WIA HD2200SY",
        type: "Dreh-Fräszentrum",
        status: "aktiv",
        shiftModel: "1 Schicht",
        capabilities: "Y-Achse, Gegenspindel, Komplettbearbeitung, Stangenlader",
        notes: "Beste Wahl für komplexe Dreh-Fräs-Teile."
      }
    ],
    materials: [
      {
        id: "mat_kunststoff",
        name: "Kunststoff",
        risk: "niedrig",
        machinability: "gut",
        notes: "Gute Passung für Prototypen und Kleinserien."
      },
      {
        id: "mat_aluminium",
        name: "Aluminium",
        risk: "niedrig",
        machinability: "sehr gut",
        notes: "Standardmaterial mit guter Kalkulierbarkeit."
      },
      {
        id: "mat_stahl",
        name: "zerspanbarer Stahl",
        risk: "mittel",
        machinability: "mittel",
        notes: "Risiko haengt stark von Sorte, Toleranz und Werkzeugstandzeit ab."
      }
    ],
    partners: [
      {
        id: "par_it_overflow",
        name: "Partnerbetrieb Italien - Overflow",
        country: "IT",
        capability: "Drehen, Fräsen, Serienentlastung",
        status: "potenziell",
        trustLevel: "mittel",
        notes: "Für hohe Auslastung und planbare externe Fertigung prüfen."
      }
    ],
    companies: [
      {
        id: "cmp_osmechplast",
        name: "OS.MECHPLAST SRLS",
        country: "IT",
        status: "aktiv",
        legalForm: "SRLS",
        notes: "Startgesellschaft für das ERP. Weitere Gesellschaften erst später."
      }
    ],
    roles: [
      {
        id: "rol_admin",
        name: "Admin",
        area: "System",
        accessLevel: "voll",
        status: "aktiv",
        notes: "Darf alle Module sehen und Daten sichern."
      },
      {
        id: "rol_sales",
        name: "Vertrieb",
        area: "CRM / RFQ",
        accessLevel: "bearbeiten",
        status: "aktiv",
        notes: "Kunden, Kontakte, RFQ, Angebote und Aufträge."
      },
      {
        id: "rol_production",
        name: "Produktion",
        area: "Produktion / MRP",
        accessLevel: "bearbeiten",
        status: "aktiv",
        notes: "Maschinen, Arbeitspläne, Fertigungsaufträge und Rückmeldungen."
      },
      {
        id: "rol_finance_locked",
        name: "Finanzen gesperrt",
        area: "Finanzen",
        accessLevel: "gesperrt",
        status: "in pruefung",
        notes: "Italienische Steuer- und E-Rechnungslogik erst nach Commercialista-Prüfung freischalten."
      }
    ],
    auditLogs: [
      {
        id: "aud_seed",
        timestamp: "2026-06-25T00:00:00.000Z",
        user: "System",
        collection: "system",
        recordId: "seed",
        action: "angelegt",
        summary: "Start-Historie für Audit, Freigaben, Lagerbewegungen und Finanzbuchungen."
      }
    ],
    numberRanges: [
      {
        id: "num_rfq",
        code: "RFQ",
        nextNumber: 1002,
        pattern: "RFQ-{YYYY}-{###}",
        ownerArea: "Sales",
        status: "aktiv",
        notes: "Nummernkreis für Anfragen."
      },
      {
        id: "num_quote",
        code: "ANG",
        nextNumber: 2,
        pattern: "ANG-{YYYY}-{###}",
        ownerArea: "Sales",
        status: "aktiv",
        notes: "Nummernkreis für Angebote."
      },
      {
        id: "num_invoice",
        code: "RE",
        nextNumber: 1,
        pattern: "RE-{YYYY}-{###}",
        ownerArea: "Finanzen",
        status: "gesperrt",
        notes: "Rechnungsnummern erst mit Finanzfreigabe produktiv nutzen."
      }
    ],
    parts: [
      {
        id: "prt_adapterwelle",
        partNo: "OMP-0001",
        name: "Aluminium Adapterwelle",
        customerId: "cus_muster_at",
        partType: "Dreh-Frästeil",
        status: "aktiv",
        currentRevisionId: "rev_adapterwelle_a",
        notes: "Beispiel-Teil für RFQ, Zeichnung, Angebot und später Produktionsauftrag."
      }
    ],
    partRevisions: [
      {
        id: "rev_adapterwelle_a",
        partId: "prt_adapterwelle",
        revision: "A",
        status: "freigegeben",
        releaseDate: "2026-06-15",
        releasedBy: "Leitung",
        drawingRef: "adapterwelle_revA.pdf",
        stepRef: "adapterwelle_revA.step",
        notes: "Freigegebene Startrevision. Nur freigegebene Revisionen duerfen in Angebot, Auftrag und Produktion verwendet werden."
      }
    ],
    bomItems: [
      {
        id: "bom_adapter_material",
        parentPartId: "prt_adapterwelle",
        childPartId: "",
        materialGroupId: "mat_aluminium",
        quantity: 1,
        unit: "Stk",
        status: "aktiv",
        notes: "V1: Materialbezug ohne echte Stückliste; später mit Unterteilen und Varianten."
      }
    ],
    changeRequests: [
      {
        id: "chg_revision_rules",
        partId: "prt_adapterwelle",
        revisionId: "rev_adapterwelle_a",
        status: "offen",
        priority: "mittel",
        owner: "Konstruktion / Leitung",
        dueDate: "2026-07-05",
        reason: "Freigabeprozess für Zeichnung, STEP und Angebotsverwendung definieren.",
        notes: "Änderungsantraege werden später mit Pflichtfreigabe ausgebaut."
      }
    ],
    suppliers: [
      {
        id: "sup_material_it",
        name: "Materiallieferant Italien",
        country: "IT",
        category: "Aluminium / Stahl",
        status: "potenziell",
        contact: "",
        notes: "Platzhalter für echte Lieferantendaten und Preisverlauf."
      }
    ],
    purchaseRequests: [
      {
        id: "preq_adapter_mat",
        materialGroupId: "mat_aluminium",
        partId: "prt_adapterwelle",
        orderId: "",
        quantity: 120,
        unit: "Stk",
        needDate: "2026-07-01",
        status: "angefragt",
        notes: "Materialbedarf aus RFQ/Angebot prüfen."
      }
    ],
    purchaseOrders: [],
    goodsReceipts: [],
    warehouseLocations: [
      {
        id: "loc_raw",
        code: "ROH-01",
        name: "Rohmaterial",
        type: "Rohmaterial",
        status: "aktiv",
        notes: "Start-Lagerort für Stangenmaterial und Zuschnitte."
      },
      {
        id: "loc_finished",
        code: "FERT-01",
        name: "Fertigteile",
        type: "Fertigteile",
        status: "aktiv",
        notes: "Fertige Teile vor Verpackung und Versand."
      }
    ],
    stockItems: [
      {
        id: "stk_aluminium",
        materialGroupId: "mat_aluminium",
        partId: "",
        locationId: "loc_raw",
        quantity: 0,
        unit: "Stk",
        minQuantity: 0,
        status: "mangel",
        notes: "Noch kein echter Bestand erfasst; Einkauf/Reservierung prüfen."
      }
    ],
    stockMovements: [
      {
        id: "mov_seed",
        movementType: "Initial",
        materialGroupId: "mat_aluminium",
        partId: "",
        fromLocationId: "",
        toLocationId: "loc_raw",
        quantity: 0,
        unit: "Stk",
        movementDate: "2026-06-25",
        user: "System",
        status: "gebucht",
        notes: "Startbewegung für Historie und Lagerlogik."
      }
    ],
    reservations: [
      {
        id: "res_adapter_mat",
        orderId: "",
        productionOrderId: "",
        materialGroupId: "mat_aluminium",
        partId: "prt_adapterwelle",
        quantity: 120,
        unit: "Stk",
        needDate: "2026-07-01",
        status: "offen",
        notes: "Reservierung wird aus Auftrag/Produktionsauftrag verbindlich."
      }
    ],
    workPlans: [
      {
        id: "wpl_adapter_a",
        partId: "prt_adapterwelle",
        revisionId: "rev_adapterwelle_a",
        status: "entwurf",
        owner: "Produktion",
        notes: "Arbeitsplan für Adapterwelle Rev A. Vor Produktion technisch freigeben."
      }
    ],
    workOperations: [
      {
        id: "wop_adapter_10",
        workPlanId: "wpl_adapter_a",
        stepNo: 10,
        machineId: "mac_hd2200sy",
        skillNeeded: "Dreh-Fräsen / Y-Achse",
        setupHours: 2,
        cycleMin: 4,
        status: "geplant",
        notes: "Komplettbearbeitung auf HD2200SY bevorzugt."
      }
    ],
    productionOrders: [],
    operationFeedback: [],
    machineCalendarEntries: [
      {
        id: "cal_hd2200sy_week",
        machineId: "mac_hd2200sy",
        date: "2026-07-01",
        shift: "1 Schicht",
        availableHours: 8,
        bookedHours: 0,
        status: "verfuegbar",
        notes: "V1-Kalenderplatzhalter für Kapazitätsrechner und Produktionsplanung."
      }
    ],
    inspectionPlans: [
      {
        id: "ipl_adapter_a",
        partId: "prt_adapterwelle",
        revisionId: "rev_adapterwelle_a",
        status: "entwurf",
        responsible: "Qualität",
        notes: "Prüfplan für Zeichnungsmerkmale, Erstteil und Serienfreigabe."
      }
    ],
    firstArticleApprovals: [],
    inspectionReports: [],
    complaints: [],
    employees: [
      {
        id: "emp_leitung",
        name: "Leitung",
        role: "Geschäftsfuehrung / Planung",
        status: "aktiv",
        notes: "Startrolle für Freigaben, Planung und Angebotsentscheidung."
      }
    ],
    employeeSkills: [
      {
        id: "esk_hd2200sy",
        employeeId: "emp_leitung",
        skill: "Dreh-Fräsen / Y-Achse",
        level: "freigegeben",
        validUntil: "",
        notes: "Qualifikation für HD2200SY-Arbeitsgänge."
      }
    ],
    shifts: [
      {
        id: "shf_standard",
        date: "2026-07-01",
        shiftName: "Tagesschicht",
        employeeId: "emp_leitung",
        machineId: "mac_hd2200sy",
        startTime: "08:00",
        endTime: "16:00",
        status: "geplant",
        notes: "V1: einfache Schichtplanung ohne Lohnabrechnung."
      }
    ],
    absences: [],
    costCenters: [
      {
        id: "cst_sales",
        code: "1000",
        name: "Vertrieb",
        area: "Sales",
        status: "aktiv",
        notes: "Kostenstelle für Angebots- und Vertriebsaufwand."
      },
      {
        id: "cst_production",
        code: "2000",
        name: "Produktion",
        area: "Fertigung",
        status: "aktiv",
        notes: "Kostenstelle für Maschinenzeit und Fertigungsaufwand."
      }
    ],
    invoices: [],
    creditNotes: [],
    payments: [],
    openItems: [],
    financePostings: [
      {
        id: "fpo_lock",
        date: "2026-06-25",
        documentNo: "FIN-LOCK",
        type: "Sperrhinweis",
        costCenterId: "",
        status: "commercialista offen",
        amount: 0,
        lockedReason: "Italienische Steuer-, Buchungs- und E-Rechnungslogik wird erst nach fachlicher Validierung aktiviert.",
        notes: "Bis dahin nur Management- und Rechnungsgrundlagen, keine rechtsverbindliche Buchhaltung."
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return applyCustomerImports(clone(seedData));
    try {
      const parsed = JSON.parse(raw);
      return applyCustomerImports(Object.assign(clone(seedData), parsed));
    } catch (error) {
      console.warn("Could not parse local ERP data", error);
      return applyCustomerImports(clone(seedData));
    }
  }

  function normalizeName(name) {
    return String(name || "").trim().toLowerCase();
  }

  function applyCustomerImports(data) {
    const imports = window.OSM_CUSTOMER_IMPORTS || [];
    if (!imports.length) return data;

    data.customers = data.customers || [];
    data.meta = data.meta || {};
    data.meta.appliedImports = data.meta.appliedImports || [];

    let changed = false;
    imports.forEach((batch) => {
      if (!batch.id || data.meta.appliedImports.includes(batch.id)) return;

      const existingNames = new Set(data.customers.map((customer) => normalizeName(customer.name)));
      (batch.customers || []).forEach((customer) => {
        if (!customer.name || existingNames.has(normalizeName(customer.name))) return;
        data.customers.push(Object.assign({}, customer));
        existingNames.add(normalizeName(customer.name));
        changed = true;
      });

      data.meta.appliedImports.push(batch.id);
      changed = true;
    });

    if (changed) save(data);
    return data;
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return applyCustomerImports(clone(seedData));
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function findById(data, collection, id) {
    return (data[collection] || []).find((item) => item.id === id);
  }

  function recordLabel(record) {
    return record.name || record.title || record.partNo || record.revision || record.invoiceNo ||
      record.orderNo || record.quoteNo || record.documentNo || record.code || record.id;
  }

  function logAudit(data, collection, record, action) {
    if (collection === "auditLogs") return;
    const now = new Date().toISOString();
    data.auditLogs = data.auditLogs || [];
    data.auditLogs.unshift({
      id: uid("aud"),
      timestamp: now,
      user: data.meta && data.meta.currentUser ? data.meta.currentUser : "OS.MECHPLAST",
      collection,
      recordId: record.id,
      action,
      summary: `${collection}: ${recordLabel(record)} ${action}`
    });
    data.auditLogs = data.auditLogs.slice(0, 250);
  }

  function upsert(data, collection, record) {
    const items = data[collection] || [];
    const index = items.findIndex((item) => item.id === record.id);
    const now = new Date().toISOString();
    const existing = index >= 0 ? items[index] : null;
    const nextRecord = Object.assign({}, existing || {}, record, {
      createdAt: existing && existing.createdAt ? existing.createdAt : record.createdAt || now,
      createdBy: existing && existing.createdBy ? existing.createdBy : record.createdBy || "OS.MECHPLAST",
      updatedAt: now,
      updatedBy: data.meta && data.meta.currentUser ? data.meta.currentUser : "OS.MECHPLAST"
    });
    if (index >= 0) {
      items[index] = nextRecord;
    } else {
      items.push(nextRecord);
    }
    data[collection] = items;
    logAudit(data, collection, nextRecord, index >= 0 ? "aktualisiert" : "angelegt");
    save(data);
  }

  function remove(data, collection, id) {
    const existing = findById(data, collection, id);
    data[collection] = (data[collection] || []).filter((item) => item.id !== id);
    if (existing) logAudit(data, collection, existing, "geloescht");
    save(data);
  }

  function daysUntil(dateString) {
    if (!dateString) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / 86400000);
  }

  function capacityDecision(data, rfq) {
    const material = findById(data, "materials", rfq.materialGroupId);
    const quantity = Number(rfq.quantity || 0);
    const days = daysUntil(rfq.dueDate);
    const partType = rfq.partType || "drehen";
    const complexity = rfq.complexity || "mittel";
    const tolerance = rfq.tolerance || "normal";

    const machine = partType === "dreh-fraes" || complexity === "hoch"
      ? findById(data, "machines", "mac_hd2200sy")
      : findById(data, "machines", "mac_l210_a");

    const complexityFactor = { einfach: 1, mittel: 1.55, hoch: 2.35 }[complexity] || 1.55;
    const materialFactor = material && material.risk === "mittel" ? 1.25 : 1;
    const toleranceFactor = tolerance === "eng" ? 1.35 : tolerance === "kritisch" ? 1.75 : 1;
    const load = quantity * complexityFactor * materialFactor * toleranceFactor;

    let shiftNeed = "1 Schicht reicht wahrscheinlich";
    let partnerNeed = "nein";
    let extraCapacity = "nein";
    let risk = "niedrig";
    let decision = "anbieten";
    let leadTime = "ca. 5-12 Arbeitstage";
    const reasons = [];

    if (partType === "dreh-fraes") {
      reasons.push("Dreh-Fräs-Teil: HD2200SY mit Y-Achse/Gegenspindel bevorzugt.");
    }
    if (complexity === "hoch") {
      reasons.push("Hohe Komplexitaet erhöht Rüst- und Prüfaufwand.");
    }
    if (material && material.risk === "mittel") {
      reasons.push("Materialgruppe mit mittlerem Bearbeitungsrisiko.");
    }
    if (tolerance === "eng" || tolerance === "kritisch") {
      reasons.push("Toleranz erfordert technische Prüfung vor finalem Angebot.");
    }
    if (days < 10) {
      reasons.push("Kurzer Terminwunsch: Kapazitätsfenster aktiv prüfen.");
    }

    if (load > 550 || days < 10) {
      shiftNeed = "2-3 Schichten prüfen";
      risk = "mittel";
      decision = "pruefen";
      leadTime = "ca. 10-20 Arbeitstage";
    }

    if (load > 1200 || (quantity > 500 && days < 20)) {
      partnerNeed = "Partnerfertigung prüfen";
      risk = "mittel";
      decision = "pruefen";
      leadTime = "ca. 3-5 Wochen";
      reasons.push("Menge/Termin kann eigene 1-Schicht-Kapazität belasten.");
    }

    if (load > 2500 || quantity > 2000) {
      extraCapacity = "Maschinenmiete/temp. Personal prüfen";
      risk = "hoch";
      decision = "pruefen";
      leadTime = "nur nach Kapazitätsklärung";
      reasons.push("Große planbare Menge: externe Kapazität oder Zusatzschicht bewerten.");
    }

    if (!machine) {
      risk = "hoch";
      decision = "ablehnen";
      leadTime = "nicht serioes bestimmbar";
      reasons.push("Keine passende Maschine in den Stammdaten gefunden.");
    }

    return {
      machineName: machine ? machine.name : "keine passende Maschine",
      shiftNeed,
      partnerNeed,
      extraCapacity,
      risk,
      decision,
      leadTime,
      reasons
    };
  }

  window.OSM = {
    modules: [],
    data: null,
    registerModule(module) {
      this.modules.push(module);
    },
    state: {
      load,
      save,
      reset,
      uid,
      findById,
      upsert,
      remove,
      capacityDecision
    }
  };
})();
