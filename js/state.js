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
        notes: "Guter Zielkunde fuer wiederkehrende Drehteile."
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
        notes: "Reagiert auf Termintreue und schnelle Rueckmeldung."
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
        notes: "Kleines lokales Management-ERP mit RFQ, Angebot, Auftrag und Kapazitaet."
      }
    ],
    tasks: [
      {
        id: "tsk_rules",
        title: "Kapazitaetsregeln mit echten Erfahrungswerten pruefen",
        projectId: "pro_erp_v1",
        area: "MRP",
        status: "offen",
        priority: "hoch",
        owner: "Leitung",
        dueDate: "2026-06-24",
        notes: "Ruestzeit, Materialrisiko und realistische Lieferzeit je Teilefamilie ergaenzen."
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
        partName: "Aluminium Adapterwelle",
        partType: "dreh-fraes",
        materialGroupId: "mat_aluminium",
        quantity: 120,
        dueDate: "2026-07-10",
        complexity: "mittel",
        tolerance: "normal",
        status: "neu",
        fileRef: "adapterwelle_revA.pdf",
        notes: "Y-Achse wahrscheinlich sinnvoll. Wiederkehrender Bedarf moeglich."
      }
    ],
    files: [
      {
        id: "fil_adapter",
        title: "Adapterwelle Zeichnung Rev A",
        linkedModule: "RFQ",
        linkedId: "rfq_1001",
        fileType: "PDF",
        path: "adapterwelle_revA.pdf",
        version: "A",
        notes: "In V1 als Referenzpfad, spaeter echte Dateiablage in der App."
      }
    ],
    quotes: [
      {
        id: "quo_1001",
        rfqId: "rfq_1001",
        quoteNo: "ANG-2026-001",
        status: "entwurf",
        validUntil: "2026-07-01",
        leadTime: "ca. 15-20 Arbeitstage",
        priceStatus: "offen",
        risk: "mittel",
        decision: "pruefen",
        notes: "Material- und Kapazitaetsfenster vor Versand bestaetigen."
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
        notes: "Standardmaschine fuer einfache bis mittlere Drehteile."
      },
      {
        id: "mac_l210_b",
        name: "Hyundai WIA L210LMA #2",
        type: "CNC-Drehzentrum",
        status: "aktiv",
        shiftModel: "1 Schicht",
        capabilities: "Drehteile, Serienwiederholung, Entlastung",
        notes: "Parallelmaschine fuer Wiederholteile und Kapazitaet."
      },
      {
        id: "mac_hd2200sy",
        name: "Hyundai WIA HD2200SY",
        type: "Dreh-Fraeszentrum",
        status: "aktiv",
        shiftModel: "1 Schicht",
        capabilities: "Y-Achse, Gegenspindel, Komplettbearbeitung, Stangenlader",
        notes: "Beste Wahl fuer komplexe Dreh-Fraes-Teile."
      }
    ],
    materials: [
      {
        id: "mat_kunststoff",
        name: "Kunststoff",
        risk: "niedrig",
        machinability: "gut",
        notes: "Gute Passung fuer Prototypen und Kleinserien."
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
        capability: "Drehen, Fraesen, Serienentlastung",
        status: "potenziell",
        trustLevel: "mittel",
        notes: "Fuer hohe Auslastung und planbare externe Fertigung pruefen."
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

  function upsert(data, collection, record) {
    const items = data[collection] || [];
    const index = items.findIndex((item) => item.id === record.id);
    if (index >= 0) {
      items[index] = record;
    } else {
      items.push(record);
    }
    data[collection] = items;
    save(data);
  }

  function remove(data, collection, id) {
    data[collection] = (data[collection] || []).filter((item) => item.id !== id);
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
      reasons.push("Dreh-Fraes-Teil: HD2200SY mit Y-Achse/Gegenspindel bevorzugt.");
    }
    if (complexity === "hoch") {
      reasons.push("Hohe Komplexitaet erhoeht Ruest- und Pruefaufwand.");
    }
    if (material && material.risk === "mittel") {
      reasons.push("Materialgruppe mit mittlerem Bearbeitungsrisiko.");
    }
    if (tolerance === "eng" || tolerance === "kritisch") {
      reasons.push("Toleranz erfordert technische Pruefung vor finalem Angebot.");
    }
    if (days < 10) {
      reasons.push("Kurzer Terminwunsch: Kapazitaetsfenster aktiv pruefen.");
    }

    if (load > 550 || days < 10) {
      shiftNeed = "2-3 Schichten pruefen";
      risk = "mittel";
      decision = "pruefen";
      leadTime = "ca. 10-20 Arbeitstage";
    }

    if (load > 1200 || (quantity > 500 && days < 20)) {
      partnerNeed = "Partnerfertigung pruefen";
      risk = "mittel";
      decision = "pruefen";
      leadTime = "ca. 3-5 Wochen";
      reasons.push("Menge/Termin kann eigene 1-Schicht-Kapazitaet belasten.");
    }

    if (load > 2500 || quantity > 2000) {
      extraCapacity = "Maschinenmiete/temp. Personal pruefen";
      risk = "hoch";
      decision = "pruefen";
      leadTime = "nur nach Kapazitaetsklaerung";
      reasons.push("Grosse planbare Menge: externe Kapazitaet oder Zusatzschicht bewerten.");
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
