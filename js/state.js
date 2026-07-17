(function () {
  const STORAGE_KEY = "osmechplast.management.erp.v1";
  const ACTIVE_USER_KEY = "osmechplast.management.erp.activeUser.v1";
  const API_STATE_URL = "/api/state";
  const API_ME_URL = "/api/me";
  const SYNC_TIMEOUT_MS = 4500;
  let syncStatus = {
    mode: "local",
    available: false,
    status: "local",
    lastSyncAt: "",
    lastError: "",
    version: 0,
    updatedBy: ""
  };
  let authSession = {
    active: false,
    email: "",
    userId: "",
    userName: "",
    roleName: "",
    missing: false,
    reason: "",
    source: ""
  };
  const UNASSIGNED_USER_ID = "usr_login_unassigned";

  const superAdminPermissions = {
    read: true,
    write: true,
    create: true,
    update: true,
    delete: true,
    assign_tasks: true,
    view_all_modules: true,
    edit_all_modules: true
  };
  const noAccessPermissions = {
    read: false,
    write: false,
    create: false,
    update: false,
    delete: false,
    assign_tasks: false,
    view_all_modules: false,
    edit_all_modules: false
  };

  const defaultUsers = [
    {
      id: "usr_abdelaziz",
      name: "Abdelaziz",
      roleId: "rol_super_admin",
      roleName: "Super Admin",
      status: "aktiv",
      email: "ouhsine-88@hotmail.com",
      emailAliases: ["ouhsine-88@hotmail.com"],
      loginHints: ["abdelaziz"],
      permissions: superAdminPermissions
    },
    {
      id: "usr_mohammed",
      name: "Mohammed",
      roleId: "rol_super_admin",
      roleName: "Super Admin",
      status: "aktiv",
      emailAliases: [],
      loginHints: ["mohammed", "mohamed"],
      permissions: superAdminPermissions
    }
  ];

  const defaultDashboardLayouts = {
    usr_abdelaziz: [
      { id: "overview", visible: true },
      { id: "tasks", visible: true },
      { id: "sales", visible: true },
      { id: "capacity", visible: true },
      { id: "audit", visible: true },
      { id: "quickLinks", visible: true }
    ],
    usr_mohammed: [
      { id: "overview", visible: true },
      { id: "tasks", visible: true },
      { id: "production", visible: true },
      { id: "quality", visible: true },
      { id: "map", visible: true },
      { id: "quickLinks", visible: true }
    ]
  };

  const seedData = {
    users: clone(defaultUsers),
    customers: [
      {
        id: "cus_muster_at",
        name: "Muster Maschinenbau GmbH",
        country: "AT",
        industry: "Sondermaschinenbau",
        importance: "hoch",
        phone: "+43 000 000000",
        website: "https://example.com",
        status: "aktiv",
        notes: "Guter Zielkunde für wiederkehrende Drehteile."
      },
      {
        id: "cus_internal",
        name: "OS.MECHPLAST intern",
        country: "IT",
        industry: "CNC-Lohnfertigung",
        importance: "normal",
        phone: "",
        website: "",
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
        linkedin: "",
        language: "DE",
        consent: "Kontakt vorhanden",
        notes: "Reagiert auf Termintreue und schnelle Rückmeldung."
      }
    ],
    sales_paths: [],
    sales_path_events: [],
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
        description: "Rüstzeit, Materialrisiko und realistische Lieferzeit je Teilefamilie ergänzen.",
        projectId: "pro_erp_v1",
        area: "Fertigung",
        status: "neu",
        priority: "hoch",
        owner: "Abdelaziz",
        assignedTo: "usr_abdelaziz",
        createdBy: "usr_abdelaziz",
        dueDate: "2026-06-24",
        customerId: "",
        orderId: "",
        comments: "Startnotiz: Erfahrungswerte aus echten Angeboten nachtragen.",
        history: "2026-06-25 System: Aufgabe angelegt.",
        notes: "Rüstzeit, Materialrisiko und realistische Lieferzeit je Teilefamilie ergaenzen."
      },
      {
        id: "tsk_rfq_template",
        title: "RFQ-Pflichtfelder finalisieren",
        description: "Pflichtfelder für Anfrage und Angebot prüfen.",
        projectId: "pro_erp_v1",
        area: "Sales",
        status: "in arbeit",
        priority: "mittel",
        owner: "Mohammed",
        assignedTo: "usr_mohammed",
        createdBy: "usr_abdelaziz",
        dueDate: "2026-06-20",
        customerId: "cus_muster_at",
        orderId: "",
        comments: "Bitte technische Pflichtfelder mit Fertigung abstimmen.",
        history: "2026-06-25 System: Aufgabe angelegt.",
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
        id: "rol_super_admin",
        name: "Super Admin",
        area: "Alle Bereiche",
        accessLevel: "voll",
        status: "aktiv",
        permissions: superAdminPermissions,
        notes: "Abdelaziz und Mohammed haben Vollzugriff auf alle ERP-Module. Workspaces trennen nur die Oberfläche, nicht die Rechte."
      },
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
    mapPoints: [
      {
        id: "map_customer_at",
        type: "customer",
        linkedCollection: "customers",
        linkedId: "cus_muster_at",
        name: "Muster Maschinenbau GmbH",
        country: "AT",
        city: "Linz",
        status: "aktiv",
        lat: 48.3069,
        lng: 14.2858,
        notes: "Dummy-Koordinate für Kundenkarte."
      },
      {
        id: "map_osmp",
        type: "customer",
        linkedCollection: "customers",
        linkedId: "cus_internal",
        name: "OS.MECHPLAST SRLS",
        country: "IT",
        city: "Ala, Trento",
        status: "intern",
        lat: 45.7606,
        lng: 11.0055,
        notes: "Interner Standort."
      },
      {
        id: "map_supplier_it",
        type: "supplier",
        linkedCollection: "suppliers",
        linkedId: "sup_material_it",
        name: "Materiallieferant Italien",
        country: "IT",
        city: "Norditalien",
        status: "potenziell",
        lat: 45.4642,
        lng: 9.19,
        notes: "Dummy-Koordinate für Lieferantenkarte."
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

  function ensureUserModel(data) {
    data.users = Array.isArray(data.users) ? data.users : [];
    defaultUsers.forEach((user) => {
      const existing = data.users.find((item) => item.id === user.id);
      if (existing) {
        existing.name = user.name;
        existing.roleId = "rol_super_admin";
        existing.roleName = "Super Admin";
        existing.status = "aktiv";
        if (!existing.email && user.email) existing.email = user.email;
        existing.emailAliases = Array.isArray(existing.emailAliases) ? existing.emailAliases : clone(user.emailAliases || []);
        (user.emailAliases || []).forEach((email) => {
          if (email && !existing.emailAliases.includes(email)) existing.emailAliases.push(email);
        });
        existing.loginHints = Array.isArray(existing.loginHints) && existing.loginHints.length ? existing.loginHints : clone(user.loginHints || []);
        existing.permissions = clone(superAdminPermissions);
      } else {
        data.users.push(clone(user));
      }
    });

    data.roles = Array.isArray(data.roles) ? data.roles : [];
    const superRole = data.roles.find((role) => role.id === "rol_super_admin");
    if (superRole) {
      superRole.name = "Super Admin";
      superRole.accessLevel = "voll";
      superRole.status = "aktiv";
      superRole.permissions = clone(superAdminPermissions);
    } else {
      data.roles.unshift({
        id: "rol_super_admin",
        name: "Super Admin",
        area: "Alle Bereiche",
        accessLevel: "voll",
        status: "aktiv",
        permissions: clone(superAdminPermissions),
        notes: "Abdelaziz und Mohammed haben Vollzugriff auf alle ERP-Module."
      });
    }

    const meta = ensureMeta(data);
    delete meta.currentUser;
    delete meta.authenticatedSessionActive;
    delete meta.authenticatedEmail;
    delete meta.authenticatedName;
    delete meta.authenticatedAt;
    delete meta.authenticatedUserMissing;
    delete meta.authenticatedUserId;
    meta.dashboardLayouts = meta.dashboardLayouts || {};
    Object.keys(defaultDashboardLayouts).forEach((userId) => {
      if (!Array.isArray(meta.dashboardLayouts[userId])) {
        meta.dashboardLayouts[userId] = clone(defaultDashboardLayouts[userId]);
      }
    });
    meta.sidebarCollapsed = meta.sidebarCollapsed || {};
  }

  function ensureTaskModel(data) {
    data.tasks = Array.isArray(data.tasks) ? data.tasks : [];
    data.tasks.forEach((task) => {
      if (task.status === "offen") task.status = "neu";
      if (!task.description) task.description = task.notes || "";
      if (!task.assignedTo) {
        const owner = String(task.owner || "").toLowerCase();
        task.assignedTo = owner.includes("mohammed") ? "usr_mohammed" : "usr_abdelaziz";
      }
      if (!task.createdBy) task.createdBy = "usr_abdelaziz";
      if (!task.comments) task.comments = "";
      if (!task.history) task.history = "";
    });
  }

  function ensureMapModel(data) {
    data.mapPoints = Array.isArray(data.mapPoints) ? data.mapPoints : [];
    const existing = new Set(data.mapPoints.map((point) => point.id));
    (seedData.mapPoints || []).forEach((point) => {
      if (!existing.has(point.id)) data.mapPoints.push(clone(point));
    });
  }

  function ensureSalesPathModel(data) {
    data.sales_paths = Array.isArray(data.sales_paths) ? data.sales_paths : [];
    data.sales_path_events = Array.isArray(data.sales_path_events) ? data.sales_path_events : [];
  }

  function ensureSystem(data) {
    data.meta = data.meta || {};
    ensureUserModel(data);
    ensureTaskModel(data);
    ensureMapModel(data);
    ensureSalesPathModel(data);
    return data;
  }

  function setSyncStatus(next) {
    syncStatus = Object.assign({}, syncStatus, next);
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("osm-sync-status", { detail: syncInfo() }));
    }
  }

  function syncInfo() {
    return Object.assign({}, syncStatus);
  }

  function cloudPossible() {
    return typeof fetch === "function" && location.protocol.startsWith("http");
  }

  function cloudIdentityRequired() {
    if (!cloudPossible()) return false;
    const host = String(location.hostname || "").toLowerCase();
    return host && host !== "localhost" && host !== "127.0.0.1";
  }

  function withTimeout(promise, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Cloud-Speicher nicht erreichbar.")), timeoutMs);
      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  async function requestJson(url, options) {
    const response = await withTimeout(fetch(url, options), SYNC_TIMEOUT_MS);
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (error) {
      throw new Error("Cloud-Speicher ist hier nicht aktiv.");
    }
    if (!response.ok || !payload || payload.ok === false) {
      throw new Error(payload && payload.error ? payload.error : "Cloud-Speicher nicht verfügbar.");
    }
    return payload;
  }

  function markCloudMeta(data, payload) {
    const meta = ensureMeta(data);
    meta.storageMode = "cloud";
    meta.lastCloudSyncAt = payload.updatedAt || new Date().toISOString();
    meta.lastCloudSyncBy = payload.updatedBy || payload.user || currentUser(data);
    meta.cloudVersion = payload.version || meta.cloudVersion || 0;
  }

  function loadLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ensureSystem(applyCustomerImports(clone(seedData)));
    try {
      const parsed = JSON.parse(raw);
      return ensureSystem(applyCustomerImports(Object.assign(clone(seedData), parsed)));
    } catch (error) {
      console.warn("Could not parse local ERP data", error);
      return ensureSystem(applyCustomerImports(clone(seedData)));
    }
  }

  async function load() {
    const localData = loadLocal();
    if (!cloudPossible()) {
      setSyncStatus({ mode: "local", available: false, status: "local", lastError: "" });
      return localData;
    }

    try {
      setSyncStatus({ status: "syncing", lastError: "" });
      const payload = await requestJson(API_STATE_URL, { method: "GET" });
      if (payload.found && payload.data) {
        const remoteData = ensureSystem(applyCustomerImports(Object.assign(clone(seedData), payload.data)));
        markCloudMeta(remoteData, payload);
        saveLocalOnly(remoteData);
        setSyncStatus({
          mode: "cloud",
          available: true,
          status: "synced",
          lastSyncAt: payload.updatedAt || new Date().toISOString(),
          lastError: "",
          version: payload.version || 0,
          updatedBy: payload.updatedBy || ""
        });
        return remoteData;
      }

      await pushCloud(localData, "Erste ERP-Daten aus lokalem Stand übernommen");
      return localData;
    } catch (error) {
      setSyncStatus({
        mode: "local",
        available: false,
        status: "offline",
        lastError: error.message,
        lastSyncAt: ""
      });
      return localData;
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

    if (changed) saveLocalOnly(data);
    return data;
  }

  function currentUser(data) {
    const user = currentUserRecord(data);
    return user ? user.name : "Abdelaziz";
  }

  function localActiveUserId() {
    try {
      return localStorage.getItem(ACTIVE_USER_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function setLocalActiveUserId(userId) {
    try {
      localStorage.setItem(ACTIVE_USER_KEY, userId);
    } catch (error) {
      // Local user selection is a UI preference. If storage is blocked, the app still works.
    }
  }

  function clearLocalUserPreference() {
    try {
      localStorage.removeItem(ACTIVE_USER_KEY);
    } catch (error) {
      // The Cloudflare login remains the authority when local storage is blocked.
    }
  }

  function isKnownUser(data, userId) {
    return !!(userId && (data.users || []).some((user) => user.id === userId));
  }

  function currentUserId(data) {
    if (authSession.active && authSession.missing) {
      return UNASSIGNED_USER_ID;
    }
    if (authSession.active && authSession.userId && isKnownUser(data, authSession.userId)) {
      return authSession.userId;
    }
    const localUser = localActiveUserId();
    if (isKnownUser(data, localUser)) return localUser;
    return "usr_abdelaziz";
  }

  function authMissingUser() {
    return {
      id: UNASSIGNED_USER_ID,
      name: "Login nicht zugeordnet",
      roleId: "rol_unassigned",
      roleName: "Cloudflare Login",
      status: "gesperrt",
      email: authSession.email || "",
      permissions: noAccessPermissions
    };
  }

  function currentUserRecord(data) {
    const userId = currentUserId(data);
    if (userId === UNASSIGNED_USER_ID) return authMissingUser();
    return (data.users || []).find((user) => user.id === userId) || (data.users || [])[0] || defaultUsers[0];
  }

  function setCurrentUser(data, userId, options = {}) {
    const user = (data.users || []).find((item) => item.id === userId);
    if (!user) return false;
    const meta = ensureMeta(data);
    meta.lastLocalUserSwitchAt = new Date().toISOString();
    setLocalActiveUserId(user.id);
    if (options.cloud === true) {
      save(data, { summary: `Benutzer gewechselt: ${user.name}` });
    } else {
      saveLocalOnly(data);
    }
    return true;
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeLoginToken(value) {
    return normalizeEmail(value).replace(/[^a-z0-9]/g, "");
  }

  function userMatchesEmail(user, email) {
    const normalizedEmail = normalizeEmail(email);
    const localPart = normalizedEmail.split("@")[0] || normalizedEmail;
    const token = normalizeLoginToken(localPart);
    const exactEmails = []
      .concat(user.email || [])
      .concat(user.mail || [])
      .concat(user.emailAliases || [])
      .map(normalizeEmail)
      .filter(Boolean);

    if (exactEmails.includes(normalizedEmail)) return true;

    const hints = []
      .concat(user.loginHints || [])
      .concat(user.name || [])
      .map(normalizeLoginToken)
      .filter(Boolean);

    return hints.some((hint) => hint && token.includes(hint));
  }

  function userForEmail(data, email) {
    const users = data.users || [];
    return users.find((user) => userMatchesEmail(user, email)) || null;
  }

  async function loadAuthenticatedIdentity() {
    if (!cloudPossible()) return { ok: false, reason: "local" };
    try {
      return await requestJson(API_ME_URL, { method: "GET" });
    } catch (error) {
      return { ok: false, reason: "unavailable", error: error.message };
    }
  }

  function setAuthSession(next) {
    authSession = Object.assign({
      active: false,
      email: "",
      userId: "",
      userName: "",
      roleName: "",
      missing: false,
      reason: "",
      source: ""
    }, next || {});
  }

  function authenticatedUserInfo() {
    return Object.assign({}, authSession);
  }

  async function applyAuthenticatedUser(data) {
    const payload = await loadAuthenticatedIdentity();
    const identity = payload && payload.identity ? payload.identity : payload;
    const email = normalizeEmail(identity && identity.email);
    if (!email) {
      if (cloudIdentityRequired()) {
        setAuthSession({
          active: true,
          missing: true,
          reason: "no-email",
          source: identity && identity.source ? identity.source : "none"
        });
      } else {
        setAuthSession({ active: false, reason: "local" });
      }
      return { ok: false, reason: "no-email" };
    }

    const matchedUser = userForEmail(data, email);
    if (!matchedUser) {
      setAuthSession({
        active: true,
        email,
        missing: true,
        reason: "no-user-match",
        source: identity && identity.source ? identity.source : ""
      });
      return { ok: false, reason: "no-user-match", email };
    }

    setAuthSession({
      active: true,
      email,
      userId: matchedUser.id,
      userName: matchedUser.name,
      roleName: matchedUser.roleName || "Super Admin",
      missing: false,
      reason: "",
      source: identity && identity.source ? identity.source : ""
    });
    if (currentUserId(data) !== matchedUser.id) {
      setCurrentUser(data, matchedUser.id, { cloud: false });
    } else {
      setLocalActiveUserId(matchedUser.id);
    }

    return { ok: true, email, userId: matchedUser.id, userName: matchedUser.name };
  }

  function permissionsForCurrentUser(data) {
    if (authSession.active && authSession.missing) {
      return Object.assign({}, noAccessPermissions);
    }
    const user = currentUserRecord(data);
    return Object.assign({}, superAdminPermissions, user && user.permissions ? user.permissions : {});
  }

  function ensureMeta(data) {
    data.meta = data.meta || {};
    return data.meta;
  }

  function saveLocalOnly(data) {
    const meta = ensureMeta(data);
    meta.lastLocalSaveAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function save(data, options = {}) {
    saveLocalOnly(data);
    if (options.cloud !== false) {
      pushCloud(data, options.summary || "Automatische Speicherung");
    }
  }

  async function pushCloud(data, summary) {
    if (!cloudPossible()) {
      setSyncStatus({ mode: "local", available: false, status: "local" });
      return { ok: false, mode: "local" };
    }

    try {
      setSyncStatus({ status: "syncing", lastError: "" });
      const payload = await requestJson(API_STATE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          data,
          user: currentUser(data),
          eventType: "state_saved",
          summary: summary || "ERP-Daten gespeichert"
        })
      });
      markCloudMeta(data, payload);
      saveLocalOnly(data);
      setSyncStatus({
        mode: "cloud",
        available: true,
        status: "synced",
        lastSyncAt: payload.updatedAt || new Date().toISOString(),
        lastError: "",
        version: payload.version || 0,
        updatedBy: payload.updatedBy || currentUser(data)
      });
      return { ok: true, mode: "cloud", payload };
    } catch (error) {
      setSyncStatus({
        mode: "local",
        available: false,
        status: "offline",
        lastError: error.message
      });
      return { ok: false, mode: "local", error };
    }
  }

  async function saveCheckpoint(data, reason) {
    const now = new Date().toISOString();
    const meta = ensureMeta(data);
    const user = currentUser(data);
    const version = Number(meta.saveVersion || 0) + 1;
    const summary = reason || "Manuelle Speicherung";

    meta.saveVersion = version;
    meta.lastManualSaveAt = now;
    meta.lastManualSaveBy = user;
    meta.saveHistory = Array.isArray(meta.saveHistory) ? meta.saveHistory : [];
    meta.saveHistory.unshift({
      id: uid("sav"),
      timestamp: now,
      user,
      version,
      summary
    });
    meta.saveHistory = meta.saveHistory.slice(0, 80);

    data.auditLogs = data.auditLogs || [];
    data.auditLogs.unshift({
      id: uid("aud"),
      timestamp: now,
      user,
      collection: "system",
      recordId: "manual-save",
      action: "gespeichert",
      summary: `${summary} · Version ${version}`
    });
    data.auditLogs = data.auditLogs.slice(0, 250);

    saveLocalOnly(data);
    return pushCloud(data, summary);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return ensureSystem(applyCustomerImports(clone(seedData)));
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

  function changedFields(before, after) {
    if (!before) return ["Datensatz neu angelegt"];
    const ignore = new Set(["updatedAt", "updatedBy", "createdAt", "createdBy", "history"]);
    return Object.keys(after || {})
      .filter((key) => !ignore.has(key) && JSON.stringify(before[key] ?? "") !== JSON.stringify(after[key] ?? ""))
      .map((key) => `${key}: "${before[key] ?? ""}" → "${after[key] ?? ""}"`)
      .slice(0, 8);
  }

  function logAudit(data, collection, record, action, before) {
    if (collection === "auditLogs") return;
    const now = new Date().toISOString();
    const changes = changedFields(before, record);
    data.auditLogs = data.auditLogs || [];
    data.auditLogs.unshift({
      id: uid("aud"),
      timestamp: now,
      user: currentUser(data),
      collection,
      recordId: record.id,
      action,
      changedFields: changes,
      summary: `${collection}: ${recordLabel(record)} ${action}${changes.length ? ` · ${changes.join("; ")}` : ""}`
    });
    data.auditLogs = data.auditLogs.slice(0, 250);
  }

  function appendTaskHistory(data, task, action, before) {
    if (!task || !task.id) return task;
    const now = new Date().toISOString();
    const changes = changedFields(before, task);
    const line = `${new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(now))} ${currentUser(data)}: ${action}${changes.length ? ` · ${changes.join("; ")}` : ""}`;
    task.history = [line, task.history || ""].filter(Boolean).join("\n");
    if (!task.createdBy) task.createdBy = currentUserId(data);
    if (!task.assignedTo) task.assignedTo = currentUserId(data);
    return task;
  }

  function upsert(data, collection, record) {
    const items = data[collection] || [];
    const index = items.findIndex((item) => item.id === record.id);
    const now = new Date().toISOString();
    const existing = index >= 0 ? items[index] : null;
    let nextRecord = Object.assign({}, existing || {}, record, {
      createdAt: existing && existing.createdAt ? existing.createdAt : record.createdAt || now,
      createdBy: existing && existing.createdBy ? existing.createdBy : record.createdBy || currentUser(data),
      updatedAt: now,
      updatedBy: currentUser(data)
    });
    if (collection === "tasks") {
      nextRecord = appendTaskHistory(data, nextRecord, index >= 0 ? "aktualisiert" : "angelegt", existing);
    }
    if (index >= 0) {
      items[index] = nextRecord;
    } else {
      items.push(nextRecord);
    }
    data[collection] = items;
    logAudit(data, collection, nextRecord, index >= 0 ? "aktualisiert" : "angelegt", existing);
    save(data);
  }

  function remove(data, collection, id) {
    const existing = findById(data, collection, id);
    data[collection] = (data[collection] || []).filter((item) => item.id !== id);
    if (existing) logAudit(data, collection, existing, "gelöscht", existing);
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
      saveCheckpoint,
      pushCloud,
      syncInfo,
      reset,
      uid,
      findById,
      currentUser,
      currentUserId,
      currentUserRecord,
      setCurrentUser,
      clearLocalUserPreference,
      applyAuthenticatedUser,
      authenticatedUserInfo,
      permissionsForCurrentUser,
      upsert,
      remove,
      capacityDecision
    }
  };
})();
