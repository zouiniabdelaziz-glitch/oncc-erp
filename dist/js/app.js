(function () {
  const OSM = window.OSM;
  let searchTerm = "";

  const sidebarGroups = [
    {
      id: "start",
      title: "Start",
      links: [
        ["dashboard", "Start"],
        ["area-management", "Management Dashboard"]
      ]
    },
    {
      id: "sales",
      title: "Vertrieb & CRM",
      links: [
        ["area-sales", "Übersicht"],
        ["customers", "Kunden"],
        ["rfqs", "RFQs / Anfragen"],
        ["offer-calculator", "Angebotsrechner"],
        ["quotes", "Angebote"],
        ["orders", "Aufträge"]
      ]
    },
    {
      id: "production",
      title: "Fertigung",
      links: [
        ["area-production", "Übersicht"],
        ["work-plans", "Arbeitsvorbereitung"],
        ["work-operations", "Arbeitsgänge"],
        ["production-orders", "Fertigungsaufträge"],
        ["operation-feedback", "Rückmeldungen"],
        ["machines", "Maschinen"],
        ["capacity", "Kapazität"],
        ["machine-calendar", "Maschinenkalender"]
      ]
    },
    {
      id: "procurement",
      title: "Material / Einkauf",
      links: [
        ["area-procurement", "Übersicht"],
        ["materials", "Materialgruppen"],
        ["purchase-requests", "Materialbedarf"],
        ["suppliers", "Lieferanten"],
        ["purchase-orders", "Bestellungen"],
        ["goods-receipts", "Wareneingang"],
        ["partners", "Partnerbetriebe"]
      ]
    },
    {
      id: "inventory",
      title: "Lager",
      links: [
        ["area-inventory", "Übersicht"],
        ["warehouse-locations", "Lagerorte"],
        ["stock-items", "Bestand"],
        ["stock-movements", "Bewegungen"],
        ["reservations", "Reservierungen"]
      ]
    },
    {
      id: "quality",
      title: "Qualität",
      links: [
        ["area-quality", "Übersicht"],
        ["inspection-plans", "Prüfpläne"],
        ["first-article", "Erstteilfreigabe"],
        ["inspection-reports", "Messprotokolle"],
        ["complaints", "Reklamationen"]
      ]
    },
    {
      id: "documents",
      title: "Dokumente / PDM",
      links: [
        ["area-pdm", "Übersicht"],
        ["parts", "Teile"],
        ["part-revisions", "Revisionen"],
        ["files", "Dokumente"],
        ["bom-items", "Stücklisten"],
        ["change-requests", "Änderungen"]
      ]
    },
    {
      id: "people",
      title: "Personal",
      links: [
        ["area-people", "Übersicht"],
        ["employees", "Mitarbeiter"],
        ["employee-skills", "Qualifikationen"],
        ["shifts", "Schichten"],
        ["absences", "Abwesenheiten"]
      ]
    },
    {
      id: "tasks-calendar",
      title: "Aufgaben / Kalender",
      links: [
        ["tasks", "Aufgaben"],
        ["projects", "Projekte"],
        ["machine-calendar", "Kalender"]
      ]
    },
    {
      id: "maps-reports",
      title: "Karte / Berichte",
      links: [
        ["maps", "Karte / Maps"],
        ["module-map", "Berichte"],
        ["area-logistics", "Übersicht"],
        ["deliveries", "Lieferstatus"]
      ]
    },
    {
      id: "finance",
      title: "Finanzen",
      links: [
        ["area-finance", "Übersicht"],
        ["cost-centers", "Kostenstellen"],
        ["invoices", "Rechnungen"],
        ["credit-notes", "Gutschriften"],
        ["payments", "Zahlungen"],
        ["open-items", "Offene Posten"],
        ["finance-postings", "Finanzbuchungen"]
      ]
    },
    {
      id: "system",
      title: "System & Einstellungen",
      links: [
        ["area-system", "Übersicht"],
        ["companies", "Gesellschaft"],
        ["users", "Benutzerprofile"],
        ["roles", "Rollen"],
        ["security", "Sicherheit"],
        ["number-ranges", "Nummernkreise"],
        ["audit-log", "Änderungshistorie"],
        ["settings", "Einstellungen"]
      ]
    }
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function displayText(value) {
    const text = String(value ?? "");
    const dictionary = {
      "pruefen": "prüfen",
      "in pruefung": "in Prüfung",
      "ueberfaellig": "überfällig",
      "geloescht": "gelöscht",
      "verfuegbar": "verfügbar",
      "bestaetigt": "bestätigt",
      "geschaetzt": "geschätzt"
    };
    if (dictionary[text]) return dictionary[text];
    return text
      .replaceAll("fuer", "für")
      .replaceAll("Fuer", "Für")
      .replaceAll("Zurueck", "Zurück")
      .replaceAll("zurueck", "zurück")
      .replaceAll("Kapazitaets", "Kapazitäts")
      .replaceAll("Kapazitaet", "Kapazität")
      .replaceAll("Qualitaet", "Qualität")
      .replaceAll("Pruefung", "Prüfung")
      .replaceAll("Pruef", "Prüf")
      .replaceAll(" pruefen", " prüfen")
      .replaceAll("Stueck", "Stück")
      .replaceAll("Rueck", "Rück")
      .replaceAll("Ruest", "Rüst")
      .replaceAll("Aender", "Änder")
      .replaceAll("aender", "änder")
      .replaceAll("Naechst", "Nächst")
      .replaceAll("naechst", "nächst")
      .replaceAll("Eintraege", "Einträge")
      .replaceAll("Auftraege", "Aufträge")
      .replaceAll("Arbeitsplaene", "Arbeitspläne")
      .replaceAll("Arbeitsgaenge", "Arbeitsgänge")
      .replaceAll("Wareneingaenge", "Wareneingänge")
      .replaceAll("Faehig", "Fähig")
      .replaceAll("faehig", "fähig")
      .replaceAll("Faellig", "Fällig")
      .replaceAll("faellig", "fällig")
      .replaceAll("Gueltig", "Gültig")
      .replaceAll("gueltig", "gültig")
      .replaceAll("Loeschen", "Löschen")
      .replaceAll("loeschen", "löschen")
      .replaceAll("Schliessen", "Schließen")
      .replaceAll("oeffnen", "öffnen")
      .replaceAll("Oeffnen", "Öffnen")
      .replaceAll("moeglich", "möglich")
      .replaceAll("Moeglich", "Möglich")
      .replaceAll("ueber", "über")
      .replaceAll("Ueber", "Über")
      .replaceAll("spaeter", "später")
      .replaceAll("Spaeter", "Später");
  }

  function badge(value, tone) {
    const className = tone ? `badge badge--${tone}` : "badge";
    return `<span class="${className}">${escapeHtml(displayText(value || "-"))}</span>`;
  }

  function toneForStatus(status) {
    if ([
      "aktiv", "gewonnen", "geliefert", "fertig", "anbieten", "freigegeben",
      "gebucht", "bezahlt", "erhalten", "verfuegbar", "verfügbar", "abgeschlossen",
      "bestätigt", "reserviert", "genehmigt", "bereit", "gespeichert",
      "synchronisiert", "erledigt"
    ].includes(status)) return "ok";
    if ([
      "prüfen", "pruefen", "in arbeit", "entwurf", "neu", "offen", "geplant",
      "bestellt", "teilgeliefert", "in prüfung", "in pruefung", "angefragt",
      "ausstehend", "commercialista offen", "wartet", "potenziell", "lead",
      "wartung", "aktualisiert", "angelegt"
    ].includes(status)) return "warn";
    if ([
      "ablehnen", "abgelehnt", "verloren", "kritisch", "hoch", "gesperrt",
      "mangel", "überfällig", "ueberfaellig", "storniert", "reklamation",
      "blockiert", "problem", "gelöscht", "geloescht"
    ].includes(status)) return "danger";
    return "muted";
  }

  function label(collection, id, field) {
    const item = OSM.state.findById(OSM.data, collection, id);
    return item ? item[field || "name"] || item.title || item.quoteNo || item.orderNo ||
      item.invoiceNo || item.partNo || item.revision || item.code || item.partName || id : "-";
  }

  function options(collection, labelField) {
    return (OSM.data[collection] || []).map((item) => ({
      value: item.id,
      label: item[labelField || "name"] || item.title || item.quoteNo || item.orderNo ||
        item.invoiceNo || item.partNo || item.revision || item.code || item.partName || item.id
    }));
  }

  const helpers = {
    escapeHtml,
    displayText,
    badge,
    toneForStatus,
    label,
    options,
    decision: (rfq) => OSM.state.capacityDecision(OSM.data, rfq)
  };

  function areaTools() {
    return window.OSM_AREA_TOOLS || {};
  }

  async function start() {
    OSM.data = await OSM.state.load();
    if (OSM.state.applyAuthenticatedUser) {
      await OSM.state.applyAuthenticatedUser(OSM.data);
    }
    document.getElementById("app").innerHTML = `
      <div class="app-shell app-shell--erp">
        <aside class="sidebar">
          <a class="sidebar__brand" href="#dashboard">
            <span class="sidebar__mark">
              <img src="assets/icons/osmp-app-icon.svg" alt="" />
            </span>
            <span>
              <strong>OSMP ERP</strong>
              <small>OS.MECHPLAST Workspace</small>
            </span>
          </a>
          <div class="sidebar__user" data-region="sidebar-user"></div>
          <nav class="sidebar__nav" data-region="nav"></nav>
        </aside>
        <div class="workspace">
          <header class="top-shellbar">
            <div class="top-shellbar__left">
              <a class="top-shellbar__button" href="#dashboard">Start</a>
              <button class="top-shellbar__button" type="button" onclick="history.back()">Zurück</button>
              <input class="top-shellbar__search" type="search" data-action="global-search" placeholder="Suchen..." aria-label="Globale Suche" />
            </div>
            <div class="top-shellbar__right">
              <div class="user-switch" data-region="current-user-control"></div>
              <span class="save-status" data-save-status>Gespeichert</span>
              <button class="shellbar__tool" type="button" data-action="check-update" data-update-button>Update prüfen</button>
              <span class="update-status" data-update-status>System aktuell</span>
            </div>
          </header>
          <main class="main" data-region="content"></main>
        </div>
      </div>
    `;

    window.addEventListener("hashchange", () => {
      searchTerm = "";
      render();
    });
    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);
    window.addEventListener("osm-sync-status", () => updateSaveStatus());
    window.addEventListener("osm-update-status", () => updateUpdateStatus());
    render();
  }

  function currentModule() {
    const id = (location.hash || "#dashboard").replace("#", "");
    return OSM.modules.find((module) => module.id === id) || OSM.modules.find((module) => module.id === "dashboard") || OSM.modules[0];
  }

  function activeAreaId(activeId) {
    if (activeId.startsWith("area-")) return activeId.replace("area-", "");
    const tools = areaTools();
    const area = tools.findAreaForModule ? tools.findAreaForModule(activeId) : null;
    return area ? area.id : "";
  }

  function moduleExists(moduleId) {
    return OSM.modules.some((module) => module.id === moduleId);
  }

  function renderSidebarUser() {
    const user = OSM.state.currentUserRecord(OSM.data);
    const permissions = OSM.state.permissionsForCurrentUser(OSM.data);
    return `
      <div class="sidebar-user-card">
        <div>
          <strong>${escapeHtml(user.name)}</strong>
          <span>${escapeHtml(user.roleName || "Super Admin")}</span>
        </div>
        ${badge(permissions.edit_all_modules ? "Vollzugriff" : "eingeschränkt", permissions.edit_all_modules ? "ok" : "warn")}
      </div>
    `;
  }

  function renderNav(activeId) {
    const activeArea = activeAreaId(activeId);
    const collapsed = (OSM.data.meta && OSM.data.meta.sidebarCollapsed) || {};

    return sidebarGroups.map((group) => {
      const links = group.links.filter(([id]) => moduleExists(id));
      if (!links.length) return "";
      const groupActive = links.some(([id]) => id === activeId || (id.startsWith("area-") && id === `area-${activeArea}`));
      const isCollapsed = collapsed[group.id] === true && !groupActive;
      return `
        <section class="sidebar-group ${groupActive ? "is-active" : ""}">
          <button class="sidebar-group__toggle" type="button" data-action="toggle-sidebar-section" data-section="${escapeHtml(group.id)}" aria-expanded="${isCollapsed ? "false" : "true"}">
            <span>${escapeHtml(group.title)}</span>
            <span>${isCollapsed ? "+" : "−"}</span>
          </button>
          <div class="sidebar-group__links" ${isCollapsed ? "hidden" : ""}>
            ${links.map(([id, labelText]) => {
              const module = OSM.modules.find((item) => item.id === id);
              const active = id === activeId;
              return `
                <a class="sidebar-link ${active ? "is-active" : ""}" href="#${escapeHtml(id)}">
                  <span>${escapeHtml(module && module.icon ? module.icon : labelText.slice(0, 1))}</span>
                  ${escapeHtml(displayText(labelText || (module && module.title) || id))}
                </a>
              `;
            }).join("")}
          </div>
        </section>
      `;
    }).join("");
  }

  function renderUserSelect() {
    const region = document.querySelector('[data-region="current-user-control"]');
    if (!region) return;
    const currentId = OSM.state.currentUserId(OSM.data);
    const auth = OSM.state.authenticatedUserInfo ? OSM.state.authenticatedUserInfo() : {};
    const currentUser = OSM.state.currentUserRecord(OSM.data);
    if (auth.active && auth.userId && auth.missing !== true) {
      region.innerHTML = `
        <div class="user-switch__locked" title="${escapeHtml(auth.email || "")}">
          <strong>${escapeHtml(currentUser.name)}</strong>
          <small>${escapeHtml(currentUser.roleName || "Super Admin")}</small>
        </div>
      `;
      return;
    }

    region.innerHTML = `
      <select data-action="current-user" aria-label="Aktueller Benutzer">
        ${(OSM.data.users || []).map((user) => `
          <option value="${escapeHtml(user.id)}" ${user.id === currentId ? "selected" : ""}>
            ${escapeHtml(user.name)} · ${escapeHtml(user.roleName || "Super Admin")}
          </option>
        `).join("")}
      </select>
    `;
  }

  function render() {
    const module = currentModule();
    const authNotice = renderAuthNotice();
    document.body.dataset.view = module.id === "dashboard" ? "dashboard" : "module";
    document.body.dataset.sidebar = "erp";
    document.querySelector('[data-region="sidebar-user"]').innerHTML = renderSidebarUser();
    document.querySelector('[data-region="nav"]').innerHTML = renderNav(module.id);
    document.querySelector('[data-region="content"]').innerHTML = authNotice + (module.render
      ? module.render(OSM.data, helpers)
      : renderGeneric(module));
    document.title = `${module.title} - OS.MECHPLAST ERP`;
    renderUserSelect();
    updateSaveStatus();
    updateUpdateStatus();
  }

  function renderAuthNotice() {
    const auth = OSM.state.authenticatedUserInfo ? OSM.state.authenticatedUserInfo() : {};
    if (!auth.active || !auth.email || !auth.missing) return "";
    return `
      <div class="notice notice--warn auth-notice">
        Cloudflare-Login erkannt: ${escapeHtml(auth.email)}. Diese E-Mail ist noch keinem ERP-Benutzer zugeordnet.
        Bitte unter System & Einstellungen > Benutzerprofile beim passenden Benutzer in "Login-E-Mail (Cloudflare)" eintragen.
      </div>
    `;
  }

  function renderGeneric(module) {
    if (!module.collection) {
      return `
        ${renderTopbar(module)}
        ${renderRelatedModules(module)}
        <section class="panel panel--pad">
          <p class="muted">Dieses Modul ist als Arbeitsbereich vorbereitet.</p>
        </section>
      `;
    }

    const rows = OSM.data[module.collection] || [];
    const filteredRows = rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return `
      ${renderTopbar(module)}
      ${renderRelatedModules(module)}
      <div class="toolbar">
        <input class="search" data-action="search" value="${escapeHtml(searchTerm)}" placeholder="In diesem Modul suchen..." />
        <div class="muted small">${filteredRows.length} Einträge</div>
      </div>
      <section class="panel">
        ${filteredRows.length ? renderTable(module, filteredRows) : `<div class="empty">Noch keine Einträge in diesem Modul.</div>`}
      </section>
    `;
  }

  function renderTopbar(module) {
    const tools = areaTools();
    const area = tools.findAreaForModule ? tools.findAreaForModule(module.id) : null;
    const isDashboard = module.id === "dashboard";
    return `
      <div class="topbar">
        <div>
          ${!isDashboard ? `
            <div class="breadcrumb">
              <a href="#dashboard">Start</a>
              ${area ? `<span>/</span><a href="#area-${escapeHtml(area.id)}">${escapeHtml(area.title)}</a>` : ""}
            </div>
          ` : ""}
          <h1 class="topbar__title">${escapeHtml(displayText(module.title))}</h1>
          <p class="topbar__text">${escapeHtml(displayText(module.description || ""))}</p>
        </div>
        <div class="page-actions">
          ${!isDashboard ? `<a class="button button--quiet" href="${area ? `#area-${escapeHtml(area.id)}` : "#dashboard"}">Zurück</a>` : ""}
          ${module.collection ? `<button class="button" data-action="add" data-module="${module.id}">+ Neu</button>` : ""}
        </div>
      </div>
    `;
  }

  function renderRelatedModules(module) {
    const tools = areaTools();
    const area = tools.findAreaForModule ? tools.findAreaForModule(module.id) : null;
    if (!area) return "";
    const relatedModules = (area.modules || [])
      .map((moduleId) => tools.moduleById ? tools.moduleById(moduleId) : null)
      .filter((item) => item && item.id !== module.id);
    const relatedAreas = (area.related || [])
      .map((areaId) => tools.findArea ? tools.findArea(areaId) : null)
      .filter(Boolean);

    return `
      <div class="related-strip">
        <span class="related-strip__label">Verbunden:</span>
        <a href="#area-${escapeHtml(area.id)}">Bereichs-Dashboard</a>
        ${relatedModules.slice(0, 7).map((item) => `<a href="#${escapeHtml(item.id)}">${escapeHtml(displayText(item.title))}</a>`).join("")}
        ${relatedAreas.slice(0, 4).map((item) => `<a href="#area-${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>`).join("")}
      </div>
    `;
  }

  function renderTable(module, rows) {
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${module.columns.map((column) => `<th>${escapeHtml(displayText(column.label))}</th>`).join("")}
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${module.columns.map((column) => `
                  <td>${column.render ? column.render(row, OSM.data, helpers) : escapeHtml(displayText(row[column.key]))}</td>
                `).join("")}
                <td>
                  <div class="row-actions">
                    <button class="icon-button" data-action="edit" data-module="${module.id}" data-id="${escapeHtml(row.id)}">Bearbeiten</button>
                    <button class="icon-button icon-button--danger" data-action="delete" data-module="${module.id}" data-id="${escapeHtml(row.id)}">Löschen</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "add") openForm(target.dataset.module);
    if (action === "edit") openForm(target.dataset.module, target.dataset.id);
    if (action === "delete") deleteRecord(target.dataset.module, target.dataset.id);
    if (action === "close-modal") closeModal();
    if (action === "manual-save") manualSave();
    if (action === "refresh-cloud") refreshCloud();
    if (action === "check-update") checkUpdate();
    if (action === "apply-update") applyUpdate();
    if (action === "export-data") exportData();
    if (action === "import-data") document.getElementById("import-file").click();
    if (action === "reset-demo") resetDemoData();
    if (action === "toggle-sidebar-section") toggleSidebarSection(target.dataset.section);
  }

  async function checkUpdate() {
    if (!window.OSM_UPDATE || !window.OSM_UPDATE.check) {
      alert("Update-Funktion ist nicht geladen.");
      return;
    }
    await window.OSM_UPDATE.check();
    if (currentModule().id === "settings") render();
  }

  function applyUpdate() {
    if (!window.OSM_UPDATE || !window.OSM_UPDATE.apply) {
      alert("Update-Funktion ist nicht geladen.");
      return;
    }
    window.OSM_UPDATE.apply();
  }

  function updateUpdateStatus() {
    const element = document.querySelector("[data-update-status]");
    const button = document.querySelector("[data-update-button]");
    if (!element) return;
    const updater = window.OSM_UPDATE;
    const info = updater && updater.status ? updater.status() : { state: "idle", message: "Update" };
    element.className = `update-status update-status--${escapeHtml(info.state || "idle")}`;
    if (info.state === "available") {
      element.textContent = "Update verfügbar";
      if (button) {
        button.textContent = "Update installieren";
        button.dataset.action = "apply-update";
      }
    } else if (info.state === "checking") {
      element.textContent = "Prüfe Update...";
      if (button) {
        button.textContent = "Prüfe...";
        button.dataset.action = "check-update";
      }
    } else if (info.state === "error") {
      element.textContent = "Update Fehler";
      if (button) {
        button.textContent = "Update erneut prüfen";
        button.dataset.action = "check-update";
      }
    } else {
      element.textContent = "System aktuell";
      if (button) {
        button.textContent = "Update prüfen";
        button.dataset.action = "check-update";
      }
    }
    element.title = info.message || "";
  }

  function handleInput(event) {
    if (event.target.dataset.action === "search") {
      searchTerm = event.target.value;
      render();
      const input = document.querySelector('[data-action="search"]');
      if (input) input.focus();
    }
    if (event.target.dataset.action === "global-search") {
      searchTerm = event.target.value;
      const module = currentModule();
      if (module.collection) render();
      const input = document.querySelector('[data-action="global-search"]');
      if (input) input.focus();
    }
  }

  function handleChange(event) {
    if (event.target.dataset.action === "current-user") {
      OSM.state.setCurrentUser(OSM.data, event.target.value);
      render();
      return;
    }

    if (event.target.dataset.action !== "import-file") return;
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        OSM.data = JSON.parse(reader.result);
        OSM.state.save(OSM.data);
        render();
        updateSaveStatus("Import lokal gespeichert");
        alert("Import erledigt.");
      } catch (error) {
        alert("Import nicht möglich. Bitte eine gültige JSON-Backup-Datei wählen.");
      }
    };
    reader.readAsText(file);
  }

  function toggleSidebarSection(sectionId) {
    OSM.data.meta = OSM.data.meta || {};
    OSM.data.meta.sidebarCollapsed = OSM.data.meta.sidebarCollapsed || {};
    OSM.data.meta.sidebarCollapsed[sectionId] = !OSM.data.meta.sidebarCollapsed[sectionId];
    OSM.state.save(OSM.data, { summary: "Sidebar angepasst" });
    render();
  }

  function openForm(moduleId, id) {
    const module = OSM.modules.find((item) => item.id === moduleId);
    if (!module || !module.collection) return;
    const existing = id ? OSM.state.findById(OSM.data, module.collection, id) : null;
    const record = existing || { id: OSM.state.uid(module.prefix || module.collection.slice(0, 3)) };

    const html = `
      <div class="modal-backdrop" data-modal>
        <div class="modal">
          <div class="modal__head">
            <div class="modal__title">${existing ? "Eintrag bearbeiten" : "Neuer Eintrag"}: ${escapeHtml(displayText(module.title))}</div>
            <button class="icon-button" data-action="close-modal">Schließen</button>
          </div>
          <form data-form-module="${module.id}">
            <div class="form-grid">
              ${module.fields.map((field) => renderField(field, record)).join("")}
            </div>
            <div class="form-actions">
              <button type="button" class="button button--quiet" data-action="close-modal">Abbrechen</button>
              <button type="submit" class="button">Speichern</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
    document.querySelector(`[data-form-module="${module.id}"]`).addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const nextRecord = { id: record.id };
      module.fields.forEach((field) => {
        const element = form.elements[field.key];
        nextRecord[field.key] = field.type === "number" ? Number(element.value || 0) : element.value;
      });
      OSM.state.upsert(OSM.data, module.collection, nextRecord);
      closeModal();
      render();
    });
  }

  function renderField(field, record) {
    const defaultValue = typeof field.default === "function" ? field.default(OSM.data, helpers) : field.default;
    const value = record[field.key] ?? defaultValue ?? "";
    const wide = field.type === "textarea" || field.wide ? " form-field--wide" : "";
    const required = field.required ? " required" : "";
    let control = "";

    if (field.type === "textarea") {
      control = `<textarea name="${escapeHtml(field.key)}"${required}>${escapeHtml(value)}</textarea>`;
    } else if (field.type === "select") {
      const choices = typeof field.options === "function" ? field.options(OSM.data, helpers) : field.options || [];
      control = `
        <select name="${escapeHtml(field.key)}"${required}>
          <option value="">-</option>
          ${choices.map((option) => `
            <option value="${escapeHtml(option.value)}" ${String(value) === String(option.value) ? "selected" : ""}>
              ${escapeHtml(displayText(option.label))}
            </option>
          `).join("")}
        </select>
      `;
    } else {
      control = `<input name="${escapeHtml(field.key)}" type="${field.type || "text"}" value="${escapeHtml(value)}"${required} />`;
    }

    return `
      <div class="form-field${wide}">
        <label>${escapeHtml(displayText(field.label))}</label>
        ${control}
      </div>
    `;
  }

  function deleteRecord(moduleId, id) {
    const module = OSM.modules.find((item) => item.id === moduleId);
    if (!module || !module.collection) return;
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;
    OSM.state.remove(OSM.data, module.collection, id);
    render();
  }

  function closeModal() {
    const modal = document.querySelector("[data-modal]");
    if (modal) modal.remove();
  }

  function formatDateTime(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("de-DE", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function updateSaveStatus(message) {
    const status = document.querySelector("[data-save-status]");
    if (!status || !OSM.data) return;
    const meta = OSM.data.meta || {};
    const sync = OSM.state.syncInfo ? OSM.state.syncInfo() : {};
    const cloudStamp = sync.lastSyncAt || meta.lastCloudSyncAt;
    const localStamp = meta.lastManualSaveAt || meta.lastLocalSaveAt;
    if (message) {
      status.textContent = message;
    } else if (sync.status === "syncing") {
      status.textContent = "Synchronisiere...";
    } else if (sync.mode === "cloud" && cloudStamp) {
      status.textContent = `Cloud ${formatDateTime(cloudStamp)}`;
    } else if (sync.status === "offline") {
      status.textContent = "Lokal (Cloud offline)";
    } else {
      status.textContent = localStamp ? `Lokal ${formatDateTime(localStamp)}` : "Lokal";
    }
    status.title = sync.lastError || "Cloudflare D1 wird genutzt, sobald die D1-Bindung aktiv ist. Sonst bleibt lokale Speicherung als Fallback.";
  }

  async function manualSave() {
    updateSaveStatus("Speichere...");
    const result = await OSM.state.saveCheckpoint(OSM.data, "Manuell gespeichert");
    render();
    updateSaveStatus(result && result.ok ? "Cloud gespeichert" : "Lokal gespeichert");
  }

  async function refreshCloud() {
    updateSaveStatus("Aktualisiere...");
    OSM.data = await OSM.state.load();
    render();
    const sync = OSM.state.syncInfo ? OSM.state.syncInfo() : {};
    updateSaveStatus(sync.mode === "cloud" ? "Cloud aktualisiert" : "Lokal aktualisiert");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(OSM.data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = URL.createObjectURL(blob);
    link.download = `osmechplast-erp-backup-${today}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function resetDemoData() {
    if (!confirm("Demo-Daten wiederherstellen? Eigene lokale Änderungen werden ersetzt.")) return;
    OSM.data = OSM.state.reset();
    render();
  }

  OSM.start = start;
  OSM.render = render;
  OSM.openForm = openForm;
  OSM.helpers = helpers;
})();
