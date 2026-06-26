(function () {
  const STORAGE_KEY = "osmechplast.offer.calculator.v1";

  const materialRules = {
    Aluminium: {
      tolerance: "typisch +/-0,03 bis +/-0,05 mm",
      status: "Aktiv anbieten",
      note: "Gute Zielgruppe für praezise Dreh- und Dreh-Frästeile."
    },
    "Zerspanbarer Stahl": {
      tolerance: "typisch +/-0,03 bis +/-0,05 mm",
      status: "Aktiv anbieten",
      note: "Gut, wenn Geometrie, Toleranz und Spannung passen."
    },
    POM: {
      tolerance: "typisch +/-0,05 mm",
      status: "Aktiv anbieten",
      note: "Sehr gut für saubere Kunststoff-Drehteile."
    },
    "PA / Nylon": {
      tolerance: "typisch +/-0,10 mm",
      status: "Nur nach Prüfung",
      note: "Materialverhalten und Feuchtigkeit beachten."
    },
    "PE / PP": {
      tolerance: "typisch +/-0,10 bis +/-0,20 mm",
      status: "Nur nach Prüfung",
      note: "Enge Toleranzen eher vermeiden."
    },
    "Technische Kunststoffe": {
      tolerance: "typisch +/-0,05 bis +/-0,10 mm",
      status: "Aktiv anbieten",
      note: "Je Geometrie prüfen."
    },
    Hochleistungskunststoffe: {
      tolerance: "typisch +/-0,05 bis +/-0,15 mm",
      status: "Nur nach Prüfung",
      note: "Immer Zeichnungs- und Materialpruefung."
    },
    "Nicht aktiv anbieten": {
      tolerance: "Sonderpruefung",
      status: "Nicht aktiv anbieten",
      note: "Nicht als Standardleistung bewerben."
    }
  };

  const shippingRules = {
    Oesterreich: {
      realistic: "ca. 1-3 Werktage",
      quote: "2-4 Werktage",
      note: "Gute Zielregion wegen Naehe zu Norditalien."
    },
    Deutschland: {
      realistic: "ca. 2-4 Werktage",
      quote: "3-5 Werktage",
      note: "Sueddeutschland priorisieren."
    },
    Schweiz: {
      realistic: "ca. 3-5 Werktage",
      quote: "4-7 Werktage",
      note: "Zollabwicklung beachten."
    },
    Sonstiges: {
      realistic: "auftragsbezogen",
      quote: "auftragsbezogen prüfen",
      note: "Transportzeit individuell prüfen."
    }
  };

  const defaults = {
    sourceRfqId: "",
    partName: "",
    customerId: "",
    partType: "Buchse",
    materialGroup: "Aluminium",
    materialDetail: "EN AW-6082",
    quantity: 250,
    cycleMin: 4,
    setupHours: 2,
    workDays: 20,
    shifts: 1,
    hoursPerShift: 8,
    utilization: 75,
    targetDate: "",
    shippingDestination: "Oesterreich",
    freeL210A: 0,
    freeL210B: 0,
    freeHd2200: 0,
    freeBarLoader: 0,
    machineRate: 65,
    setupRate: 65,
    materialCost: 120,
    inspectionPacking: 40,
    shippingCost: 35,
    margin: 25
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return Object.assign({}, defaults, raw ? JSON.parse(raw) : {});
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }

  function saveDraft(draft) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  function number(value) {
    const parsed = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function money(value) {
    return `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
  }

  function qty(value) {
    return value.toLocaleString("de-DE", { maximumFractionDigits: 1 });
  }

  function riskTone(risk) {
    if (risk === "NIEDRIG") return "ok";
    if (risk === "MITTEL") return "warn";
    return "danger";
  }

  function decisionTone(decision) {
    if (decision === "ANBIETEN") return "ok";
    if (decision === "ANBIETEN NACH PRUEFUNG" || decision === "PRUEFEN") return "warn";
    return "danger";
  }

  function machineForPart(partType) {
    const l210Parts = ["Welle", "Buchse", "Huelse", "Bolzen", "Distanzstueck", "Gewindeteil"];
    if (partType === "Dreh-Frästeil") return "Hyundai WIA HD2200SY";
    if (l210Parts.includes(partType)) return "Hyundai WIA L210LMA / HD2200SY prüfen";
    return "Technische Prüfung";
  }

  function mapRfqPartType(rfq) {
    const partType = String(rfq.partType || "").toLowerCase();
    const name = String(rfq.partName || "").toLowerCase();
    if (partType.includes("dreh-fraes")) return "Dreh-Frästeil";
    if (name.includes("welle")) return "Welle";
    if (name.includes("buchse")) return "Buchse";
    if (name.includes("huelse") || name.includes("hulse")) return "Huelse";
    if (name.includes("bolzen")) return "Bolzen";
    if (name.includes("distanz")) return "Distanzstueck";
    if (name.includes("gewinde")) return "Gewindeteil";
    if (partType.includes("fraes")) return "Sonstiges";
    return "Buchse";
  }

  function mapRfqMaterial(data, rfq) {
    const material = window.OSM.state.findById(data, "materials", rfq.materialGroupId);
    const name = String(material ? material.name : "").toLowerCase();
    if (name.includes("aluminium")) return "Aluminium";
    if (name.includes("stahl")) return "Zerspanbarer Stahl";
    if (name.includes("kunststoff")) return "Technische Kunststoffe";
    return "Aluminium";
  }

  function mapShippingDestination(data, customerId) {
    const customer = window.OSM.state.findById(data, "customers", customerId);
    const country = String(customer ? customer.country : "").toUpperCase();
    if (country === "AT") return "Oesterreich";
    if (country === "DE") return "Deutschland";
    if (country === "CH") return "Schweiz";
    return "Sonstiges";
  }

  function openFromRfq(rfqId) {
    const data = window.OSM.data;
    const rfq = window.OSM.state.findById(data, "rfqs", rfqId);
    if (!rfq) {
      alert("RFQ nicht gefunden.");
      return;
    }

    const draft = Object.assign({}, loadDraft(), {
      sourceRfqId: rfq.id,
      partName: rfq.partName || "",
      customerId: rfq.customerId || "",
      partType: mapRfqPartType(rfq),
      materialGroup: mapRfqMaterial(data, rfq),
      quantity: Number(rfq.quantity || defaults.quantity),
      targetDate: rfq.dueDate || "",
      shippingDestination: mapShippingDestination(data, rfq.customerId)
    });

    saveDraft(draft);
    if (location.hash === "#offer-calculator" && window.OSM.render) {
      window.OSM.render();
    } else {
      location.hash = "#offer-calculator";
    }
  }

  function selectedFreeHours(input, machineName) {
    if (machineName === "Hyundai WIA HD2200SY") {
      return { label: "HD2200SY", hours: input.freeHd2200 };
    }

    if (input.partType === "Gewindeteil" && input.freeBarLoader > 0) {
      return { label: "Stangenlader / HD2200SY", hours: input.freeBarLoader };
    }

    return {
      label: "L210LMA #1 + #2",
      hours: input.freeL210A + input.freeL210B
    };
  }

  function calendarStatus(hours) {
    if (hours <= 0) return "Keine freie Kapazität";
    if (hours < 8) return "Engpass";
    return "Kapazität vorhanden";
  }

  function calculate(input) {
    const material = materialRules[input.materialGroup] || {
      tolerance: "Nach Zeichnung prüfen",
      status: "Material prüfen",
      note: "Material noch nicht in den Regeln."
    };
    const shipping = shippingRules[input.shippingDestination] || shippingRules.Sonstiges;
    const machineName = machineForPart(input.partType);
    const calendarChoice = selectedFreeHours(input, machineName);

    const totalMachineMinutes = input.quantity * input.cycleMin + input.setupHours * 60;
    const dailyCapacityMinutes = input.shifts * input.hoursPerShift * 60 * (input.utilization / 100);
    const monthlyCapacityMinutes = input.workDays * dailyCapacityMinutes;
    const availableMinutes = calendarChoice.hours > 0 ? calendarChoice.hours * 60 : monthlyCapacityMinutes;
    const productionDays = dailyCapacityMinutes > 0 ? Math.ceil(totalMachineMinutes / dailyCapacityMinutes) : 0;
    const recommendedDays = Math.max(productionDays + 1, 2);

    const partnerNeeded = totalMachineMinutes > availableMinutes || productionDays > input.workDays * 0.8 || input.quantity > 5000;
    const machineRentNeeded = input.quantity > 20000 || totalMachineMinutes > availableMinutes;
    const missingCoreInput = input.quantity <= 0 || input.cycleMin <= 0 || input.setupHours < 0;

    let risk = "NIEDRIG";
    let decision = "ANBIETEN";
    const reasons = [];

    if (missingCoreInput) {
      risk = "HOCH";
      decision = "PRUEFEN";
      reasons.push("Stückzahl, Zykluszeit oder Rüstzeit fehlen.");
    } else if (material.status === "Nicht aktiv anbieten") {
      risk = "HOCH";
      decision = "ABLEHNEN / SONDERPRUEFUNG";
      reasons.push("Materialgruppe ist nicht als Standardleistung vorgesehen.");
    } else if (partnerNeeded || machineRentNeeded || material.status === "Nur nach Prüfung") {
      risk = "MITTEL";
      decision = "ANBIETEN NACH PRUEFUNG";
    }

    if (partnerNeeded) {
      reasons.push("Partnerbetrieb oder Zusatzschichten prüfen.");
    }
    if (machineRentNeeded) {
      reasons.push("Maschinenmiete oder temporäres Personal nur bei sicherem Auftrag prüfen.");
    }
    if (material.status === "Nur nach Prüfung") {
      reasons.push("Materialverhalten und Zeichnung vor finalem Angebot prüfen.");
    }
    if (calendarChoice.hours > 0) {
      reasons.push(`Kalenderwert genutzt: ${qty(calendarChoice.hours)} freie Stunden (${calendarChoice.label}).`);
    } else {
      reasons.push("Kein Kalenderwert eingetragen: Rechner nutzt Standardmonat.");
    }

    const machineHours = totalMachineMinutes / 60;
    const productionCost = machineHours * input.machineRate + input.setupHours * input.setupRate;
    const costBeforeMargin = productionCost + input.materialCost + input.inspectionPacking + input.shippingCost;
    const marginRatio = Math.min(Math.max(input.margin / 100, 0), 0.95);
    const offerPrice = marginRatio < 1 ? costBeforeMargin / (1 - marginRatio) : 0;
    const unitPrice = input.quantity > 0 ? offerPrice / input.quantity : 0;

    return {
      material,
      shipping,
      machineName,
      calendarChoice,
      totalMachineMinutes,
      availableMinutes,
      productionDays,
      recommendedDays,
      partnerNeeded,
      machineRentNeeded,
      risk,
      decision,
      reasons,
      machineHours,
      productionCost,
      costBeforeMargin,
      offerPrice,
      unitPrice
    };
  }

  function quoteRisk(risk) {
    if (risk === "NIEDRIG") return "niedrig";
    if (risk === "MITTEL") return "mittel";
    return "hoch";
  }

  function quoteDecision(decision) {
    if (decision === "ANBIETEN") return "anbieten";
    if (decision.includes("ABLEHNEN")) return "ablehnen";
    return "pruefen";
  }

  function nextQuoteNo(data) {
    const year = new Date().getFullYear();
    const prefix = `ANG-${year}-`;
    const max = (data.quotes || []).reduce((highest, quote) => {
      const value = String(quote.quoteNo || "");
      if (!value.startsWith(prefix)) return highest;
      const numberPart = Number(value.slice(prefix.length));
      return Number.isFinite(numberPart) ? Math.max(highest, numberPart) : highest;
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  }

  function isoDatePlus(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function saveQuoteFromCurrent() {
    const input = readDraftFromDom();
    if (!input.sourceRfqId) {
      alert("Bitte zuerst eine RFQ über den Button 'Rechnen' aus dem RFQ-Modul übernehmen.");
      return;
    }

    const data = window.OSM.data;
    const rfq = window.OSM.state.findById(data, "rfqs", input.sourceRfqId);
    if (!rfq) {
      alert("Die verbundene RFQ wurde nicht gefunden.");
      return;
    }
    const revision = rfq.revisionId ? window.OSM.state.findById(data, "partRevisions", rfq.revisionId) : null;
    if (revision && revision.status !== "freigegeben") {
      alert("Diese RFQ verweist auf eine Teilrevision, die noch nicht freigegeben ist. Bitte zuerst im PDM freigeben.");
      return;
    }

    saveDraft(input);
    const result = calculate(input);
    const existingDraft = (data.quotes || []).find((quote) => quote.rfqId === input.sourceRfqId && quote.status === "entwurf");
    const quote = Object.assign({}, existingDraft || {}, {
      id: existingDraft ? existingDraft.id : window.OSM.state.uid("quo"),
      rfqId: input.sourceRfqId,
      partId: rfq.partId || "",
      revisionId: rfq.revisionId || "",
      quoteNo: existingDraft ? existingDraft.quoteNo : nextQuoteNo(data),
      status: "entwurf",
      validUntil: existingDraft && existingDraft.validUntil ? existingDraft.validUntil : isoDatePlus(14),
      leadTime: `${qty(result.recommendedDays)} Werktage Fertigung + ${result.shipping.quote} Transport`,
      priceStatus: "geschaetzt",
      offerPrice: Number(result.offerPrice.toFixed(2)),
      unitPrice: Number(result.unitPrice.toFixed(2)),
      machineName: result.machineName,
      risk: quoteRisk(result.risk),
      decision: quoteDecision(result.decision),
      notes: [
        `Teil: ${rfq.partName || input.partName || "-"}`,
        `Materialstatus: ${result.material.status}`,
        `Toleranz-Hinweis: ${result.material.tolerance}`,
        `Partner prüfen: ${result.partnerNeeded ? "ja" : "nein"}`,
        `Maschinenmiete prüfen: ${result.machineRentNeeded ? "ja" : "nein"}`,
        `Kalender: ${result.calendarChoice.label}`,
        `Begruendung: ${result.reasons.join(" ")}`
      ].join("\\n")
    });

    rfq.status = "angebot erstellt";
    window.OSM.state.upsert(data, "quotes", quote);
    window.OSM.state.upsert(data, "rfqs", rfq);
    alert(`Angebot ${quote.quoteNo} wurde gespeichert.`);

    if (location.hash === "#quotes" && window.OSM.render) {
      window.OSM.render();
    } else {
      location.hash = "#quotes";
    }
  }

  function readDraftFromDom() {
    const next = {};
    document.querySelectorAll("[data-calc-input]").forEach((field) => {
      const key = field.dataset.calcInput;
      next[key] = field.dataset.calcType === "number" ? number(field.value) : field.value;
    });
    return Object.assign({}, defaults, next);
  }

  function setText(name, value) {
    const element = document.querySelector(`[data-calc-output="${name}"]`);
    if (element) element.textContent = value;
  }

  function setBadge(name, value, tone) {
    const element = document.querySelector(`[data-calc-output="${name}"]`);
    if (!element) return;
    element.textContent = value;
    element.className = `badge badge--${tone}`;
  }

  function setCalendarRow(machine, hours) {
    setText(`calendar-${machine}-hours`, qty(hours));
    setText(`calendar-${machine}-minutes`, qty(hours * 60));
    setText(`calendar-${machine}-status`, calendarStatus(hours));
  }

  function update() {
    const input = readDraftFromDom();
    saveDraft(input);
    const result = calculate(input);

    setText("machine", result.machineName);
    setText("materialStatus", result.material.status);
    setText("tolerance", result.material.tolerance);
    setText("materialNote", result.material.note);
    setText("totalMinutes", qty(result.totalMachineMinutes));
    setText("availableMinutes", qty(result.availableMinutes));
    setText("productionDays", qty(result.productionDays));
    setText("recommendedDays", `${qty(result.recommendedDays)} Werktage`);
    setText("transport", `${result.shipping.quote} (${result.shipping.realistic})`);
    setText("leadTime", `${qty(result.recommendedDays)} Werktage Fertigung + ${result.shipping.quote} Transport`);
    setText("partner", result.partnerNeeded ? "JA - Partner/Schichten prüfen" : "Nein, voraussichtlich intern");
    setText("machineRent", result.machineRentNeeded ? "JA - bei planbarem Auftrag prüfen" : "Nein");
    setBadge("risk", result.risk, riskTone(result.risk));
    setBadge("decision", result.decision, decisionTone(result.decision));
    setText("machineHours", qty(result.machineHours));
    setText("productionCost", money(result.productionCost));
    setText("costBeforeMargin", money(result.costBeforeMargin));
    setText("offerPrice", money(result.offerPrice));
    setText("unitPrice", money(result.unitPrice));
    setText("calendarSource", result.calendarChoice.label);
    setText("reasons", result.reasons.join(" "));

    setCalendarRow("l210a", input.freeL210A);
    setCalendarRow("l210b", input.freeL210B);
    setCalendarRow("hd2200", input.freeHd2200);
    setCalendarRow("barloader", input.freeBarLoader);
  }

  function input(name, label, value, type) {
    return `
      <div class="form-field">
        <label>${escapeHtml(label)}</label>
        <input data-calc-input="${escapeHtml(name)}" data-calc-type="${type === "number" ? "number" : "text"}" type="${type || "text"}" value="${escapeHtml(value)}" oninput="window.OSM_CALCULATOR.update()" />
      </div>
    `;
  }

  function select(name, label, value, choices) {
    return `
      <div class="form-field">
        <label>${escapeHtml(label)}</label>
        <select data-calc-input="${escapeHtml(name)}" onchange="window.OSM_CALCULATOR.update()">
          ${choices.map((choice) => `
            <option value="${escapeHtml(choice.value)}" ${String(value) === String(choice.value) ? "selected" : ""}>${escapeHtml(choice.label)}</option>
          `).join("")}
        </select>
      </div>
    `;
  }

  function resultCell(label, output, value) {
    return `
      <div class="decision-cell">
        <div class="decision-cell__label">${escapeHtml(label)}</div>
        <div class="decision-cell__value" data-calc-output="${escapeHtml(output)}">${escapeHtml(value)}</div>
      </div>
    `;
  }

  function badgeCell(label, output, value, tone) {
    return `
      <div class="decision-cell">
        <div class="decision-cell__label">${escapeHtml(label)}</div>
        <div class="decision-cell__value"><span class="badge badge--${tone}" data-calc-output="${escapeHtml(output)}">${escapeHtml(value)}</span></div>
      </div>
    `;
  }

  function renderCalendarRow(key, machine, hours) {
    return `
      <tr>
        <td>${escapeHtml(machine)}</td>
        <td data-calc-output="calendar-${key}-hours">${escapeHtml(qty(hours))}</td>
        <td data-calc-output="calendar-${key}-minutes">${escapeHtml(qty(hours * 60))}</td>
        <td data-calc-output="calendar-${key}-status">${escapeHtml(calendarStatus(hours))}</td>
      </tr>
    `;
  }

  const calculator = {
    update,
    calculate,
    openFromRfq,
    saveQuoteFromCurrent,
    render(data) {
      const draft = loadDraft();
      if (!draft.customerId && data.customers && data.customers.length) {
        draft.customerId = data.customers[0].id;
      }
      const result = calculate(draft);
      const sourceRfq = draft.sourceRfqId ? window.OSM.state.findById(data, "rfqs", draft.sourceRfqId) : null;

      const customerOptions = (data.customers || []).map((customer) => ({
        value: customer.id,
        label: customer.name
      }));
      const materialOptions = Object.keys(materialRules).map((name) => ({ value: name, label: name }));
      const partOptions = ["Welle", "Buchse", "Huelse", "Bolzen", "Distanzstueck", "Gewindeteil", "Dreh-Frästeil", "Sonstiges"]
        .map((name) => ({ value: name, label: name }));
      const shippingOptions = Object.keys(shippingRules).map((name) => ({ value: name, label: name }));

      if (typeof setTimeout === "function") setTimeout(update, 0);

      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-sales">Vertrieb & CRM</a>
            </div>
            <h1 class="topbar__title">Angebotsrechner</h1>
            <p class="topbar__text">RFQ-Vorpruefung mit Maschine, Kapazität, Kalender, Kalkulation und Entscheidung.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-sales">Zurück</a>
            <button class="button" onclick="window.OSM_CALCULATOR.saveQuoteFromCurrent()">Als Angebot speichern</button>
            <a class="button button--quiet" href="#rfqs">RFQs</a>
          </div>
        </div>

        <div class="notice">
          Diese Logik basiert auf deiner Excel-Strategie. Aktive RFQ:
          <strong>${sourceRfq ? escapeHtml(sourceRfq.partName) : "keine RFQ übernommen"}</strong>.
          Sie ersetzt keine technische Zeichnungspruefung.
        </div>
        <input class="hidden" data-calc-input="sourceRfqId" value="${escapeHtml(draft.sourceRfqId)}" />
        <input class="hidden" data-calc-input="partName" value="${escapeHtml(draft.partName)}" />

        <section class="calculator-layout">
          <div class="panel panel--pad">
            <h2>RFQ-Eingabe</h2>
            <div class="form-grid">
              ${select("customerId", "Kunde", draft.customerId, customerOptions)}
              ${select("partType", "Teiltyp", draft.partType, partOptions)}
              ${select("materialGroup", "Materialgruppe", draft.materialGroup, materialOptions)}
              ${input("materialDetail", "Materialdetail", draft.materialDetail)}
              ${input("quantity", "Stückzahl", draft.quantity, "number")}
              ${input("cycleMin", "Zykluszeit Min/Teil", draft.cycleMin, "number")}
              ${input("setupHours", "Rüstzeit Stunden", draft.setupHours, "number")}
              ${input("targetDate", "Gewuenschter Liefertermin", draft.targetDate, "date")}
              ${select("shippingDestination", "Versandziel", draft.shippingDestination, shippingOptions)}
              ${input("workDays", "Arbeitstage verfuegbar", draft.workDays, "number")}
              ${input("shifts", "Schichten", draft.shifts, "number")}
              ${input("hoursPerShift", "Stunden pro Schicht", draft.hoursPerShift, "number")}
              ${input("utilization", "Nutzungsgrad %", draft.utilization, "number")}
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Entscheidung</h2>
            <div class="decision-grid decision-grid--two">
              ${resultCell("Empfohlene Maschine", "machine", result.machineName)}
              ${resultCell("Materialstatus", "materialStatus", result.material.status)}
              ${resultCell("Toleranz-Hinweis", "tolerance", result.material.tolerance)}
              ${resultCell("Gesamt Maschinenminuten", "totalMinutes", qty(result.totalMachineMinutes))}
              ${resultCell("Verfügbare Minuten", "availableMinutes", qty(result.availableMinutes))}
              ${resultCell("Fertigungstage", "productionDays", qty(result.productionDays))}
              ${resultCell("Lieferzeit", "leadTime", `${qty(result.recommendedDays)} Werktage Fertigung + ${result.shipping.quote} Transport`)}
              ${resultCell("Partner prüfen?", "partner", result.partnerNeeded ? "JA - Partner/Schichten prüfen" : "Nein, voraussichtlich intern")}
              ${badgeCell("Risiko", "risk", result.risk, riskTone(result.risk))}
              ${badgeCell("Angebotsentscheidung", "decision", result.decision, decisionTone(result.decision))}
            </div>
            <p class="small muted calculator-note" data-calc-output="reasons">${escapeHtml(result.reasons.join(" "))}</p>
          </div>
        </section>

        <section class="calculator-layout calculator-layout--bottom">
          <div class="panel panel--pad">
            <h2>Maschinenkalender</h2>
            <p class="muted small">Wenn hier freie Stunden eingetragen sind, nutzt der Rechner den passenden Kalenderwert. Wenn alles 0 ist, rechnet er mit dem Standardmonat.</p>
            <div class="form-grid">
              ${input("freeL210A", "L210LMA #1 freie Stunden", draft.freeL210A, "number")}
              ${input("freeL210B", "L210LMA #2 freie Stunden", draft.freeL210B, "number")}
              ${input("freeHd2200", "HD2200SY freie Stunden", draft.freeHd2200, "number")}
              ${input("freeBarLoader", "Stangenlader / HD2200SY freie Stunden", draft.freeBarLoader, "number")}
            </div>
            <div class="table-wrap calculator-table">
              <table>
                <thead><tr><th>Maschine</th><th>Freie Stunden</th><th>Freie Minuten</th><th>Status</th></tr></thead>
                <tbody>
                  ${renderCalendarRow("l210a", "L210LMA #1", draft.freeL210A)}
                  ${renderCalendarRow("l210b", "L210LMA #2", draft.freeL210B)}
                  ${renderCalendarRow("hd2200", "HD2200SY", draft.freeHd2200)}
                  ${renderCalendarRow("barloader", "Stangenlader / HD2200SY", draft.freeBarLoader)}
                </tbody>
              </table>
            </div>
            <p class="small muted">Genutzter Kalenderwert: <strong data-calc-output="calendarSource">${escapeHtml(result.calendarChoice.label)}</strong></p>
          </div>

          <div class="panel panel--pad">
            <h2>Kalkulation</h2>
            <div class="form-grid">
              ${input("machineRate", "Maschinenstundensatz EUR", draft.machineRate, "number")}
              ${input("setupRate", "Rüststundensatz EUR", draft.setupRate, "number")}
              ${input("materialCost", "Materialkosten gesamt EUR", draft.materialCost, "number")}
              ${input("inspectionPacking", "Prüfung/Verpackung EUR", draft.inspectionPacking, "number")}
              ${input("shippingCost", "Versand EUR", draft.shippingCost, "number")}
              ${input("margin", "Marge %", draft.margin, "number")}
            </div>
            <div class="result-strip">
              ${resultCell("Maschinenzeit Stunden", "machineHours", qty(result.machineHours))}
              ${resultCell("Fertigungskosten", "productionCost", money(result.productionCost))}
              ${resultCell("Kosten vor Marge", "costBeforeMargin", money(result.costBeforeMargin))}
              ${resultCell("Angebotspreis", "offerPrice", money(result.offerPrice))}
              ${resultCell("Stückpreis", "unitPrice", money(result.unitPrice))}
              ${resultCell("Maschinenmiete?", "machineRent", result.machineRentNeeded ? "JA - bei planbarem Auftrag prüfen" : "Nein")}
            </div>
            <p class="small muted">Transport: <span data-calc-output="transport">${escapeHtml(result.shipping.quote)} (${escapeHtml(result.shipping.realistic)})</span></p>
            <p class="small muted">Materialnotiz: <span data-calc-output="materialNote">${escapeHtml(result.material.note)}</span></p>
          </div>
        </section>
      `;
    }
  };

  window.OSM_CALCULATOR = calculator;
  window.OSM.registerModule({
    id: "offer-calculator",
    group: "Vertrieb & CRM",
    icon: "R",
    title: "Angebotsrechner",
    description: "Kapazitäts- und Angebotsrechner aus der OS.MECHPLAST Excel-Strategie.",
    render: calculator.render
  });
})();
