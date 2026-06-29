(function () {
  const OSM = window.OSM;
  let searchTerm = "";

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
      "pruefen": "pr\u00fcfen",
      "in pruefung": "in Pr\u00fcfung",
      "ueberfaellig": "\u00fcberf\u00e4llig",
      "geloescht": "gel\u00f6scht",
      "verfuegbar": "verf\u00fcgbar",
      "bestaetigt": "best\u00e4tigt",
      "geschaetzt": "gesch\u00e4tzt"
    };
    if (dictionary[text]) return dictionary[text];
    return text
      .replaceAll("fuer", "f\u00fcr")
      .replaceAll("Fuer", "F\u00fcr")
      .replaceAll("Zurueck", "Zur\u00fcck")
      .replaceAll("zurueck", "zur\u00fcck")
      .replaceAll("Kapazitaets", "Kapazit\u00e4ts")
      .replaceAll("Kapazitaet", "Kapazit\u00e4t")
      .replaceAll("Qualitaet", "Qualit\u00e4t")
      .replaceAll("Pruefung", "Pr\u00fcfung")
      .replaceAll("Pruef", "Pr\u00fcf")
      .replaceAll(" pruefen", " pr\u00fcfen")
      .replaceAll("Stueck", "St\u00fcck")
      .replaceAll("Rueck", "R\u00fcck")
      .replaceAll("Ruest", "R\u00fcst")
      .replaceAll("Aender", "\u00c4nder")
      .replaceAll("aender", "\u00e4nder")
      .replaceAll("Naechst", "N\u00e4chst")
      .replaceAll("naechst", "n\u00e4chst")
      .replaceAll("Eintraege", "Eintr\u00e4ge")
      .replaceAll("Auftraege", "Auftr\u00e4ge")
      .replaceAll("Arbeitsplaene", "Arbeitspl\u00e4ne")
      .replaceAll("Arbeitsgaenge", "Arbeitsg\u00e4nge")
      .replaceAll("Wareneingaenge", "Wareneing\u00e4nge")
      .replaceAll("Faehig", "F\u00e4hig")
      .replaceAll("faehig", "f\u00e4hig")
      .replaceAll("Faellig", "F\u00e4llig")
      .replaceAll("faellig", "f\u00e4llig")
      .replaceAll("Gueltig", "G\u00fcltig")
      .replaceAll("gueltig", "g\u00fcltig")
      .replaceAll("Loeschen", "L\u00f6schen")
      .replaceAll("loeschen", "l\u00f6schen")
      .replaceAll("Schliessen", "Schlie\u00dfen")
      .replaceAll("oeffnen", "\u00f6ffnen")
      .replaceAll("Oeffnen", "\u00d6ffnen")
      .replaceAll("moeglich", "m\u00f6glich")
      .replaceAll("Moeglich", "M\u00f6glich")
      .replaceAll("ueber", "\u00fcber")
      .replaceAll("Ueber", "\u00dcber")
      .replaceAll("spaeter", "sp\u00e4ter")
      .replaceAll("Spaeter", "Sp\u00e4ter");
  }
  function badge(value, tone) {
    const className = tone ? `badge badge--${tone}` : "badge";
    return `<span class="${className}">${escapeHtml(displayText(value || "-"))}</span>`;
  }

  function toneForStatus(status) {
    if ([
      "aktiv", "gewonnen", "geliefert", "fertig", "anbieten", "freigegeben",
      "gebucht", "bezahlt", "erhalten", "verfuegbar", "abgeschlossen", "bestätigt",
      "reserviert", "genehmigt", "bereit", "gespeichert", "synchronisiert"
    ].includes(status)) return "ok";
    if ([
      "pruefen", "in arbeit", "entwurf", "neu", "offen", "geplant", "bestellt",
      "teilgeliefert", "in pruefung", "angefragt", "ausstehend", "commercialista offen",
      "wartet", "potenziell", "lead", "wartung", "aktualisiert", "angelegt"
    ].includes(status)) return "warn";
    if ([
      "ablehnen", "abgelehnt", "verloren", "kritisch", "hoch", "gesperrt",
      "mangel", "ueberfaellig", "storniert", "reklamation", "blockiert", "problem",
      "geloescht"
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
    document.getElementById("app").innerHTML = `
      <div class="app-shell">
        <header class="shellbar">
          <div class="shellbar__left">
            <a class="shellbar__icon" href="#dashboard">Start</a>
            <button class="shellbar__icon" type="button" onclick="history.back()">Zurück</button>
            <a class="shellbar__brand" href="#dashboard">
              <span class="shellbar__mark">ON</span>
              <span class="shellbar__product">ONCC ERP</span>
            </a>
            <span class="shellbar__workspace">OS.MECHPLAST Workspace</span>
          </div>
          <div class="shellbar__center">
            <select class="shellbar__select" aria-label="Arbeitskontext">
              <option>Management System</option>
              <option>Vertrieb & CRM</option>
              <option>Produktion / MRP</option>
            </select>
            <input class="shellbar__search" type="search" placeholder="Suchbegriff eingeben" aria-label="Globale Suche" />
          </div>
          <div class="shellbar__right">
            <button class="shellbar__save" type="button" data-action="manual-save">Speichern</button>
            <span class="save-status" data-save-status>Lokal</span>
            <a class="shellbar__tool" href="#security">Sicherheit</a>
            <a class="shellbar__tool" href="#settings">System</a>
          </div>
        </header>
        <nav class="context-tabs" data-region="nav"></nav>
        <main class="main" data-region="content"></main>
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
    render();
  }

  function currentModule() {
    const id = (location.hash || "#dashboard").replace("#", "");
    return OSM.modules.find((module) => module.id === id) || OSM.modules[0];
  }

  function areaInitial(area) {
    return (area.title || "?").slice(0, 1).toUpperCase();
  }

  function activeAreaId(activeId) {
    if (activeId.startsWith("area-")) return activeId.replace("area-", "");
    const tools = areaTools();
    const area = tools.findAreaForModule ? tools.findAreaForModule(activeId) : null;
    return area ? area.id : "";
  }

  function renderNav(activeId) {
    const areas = window.OSM_AREAS || [];
    const activeArea = activeAreaId(activeId);
    const activeAreaRecord = areas.find((area) => area.id === activeArea);
    const quickIds = ["rfqs", "offer-calculator", "orders", "tasks", "capacity", "module-map"];
    const secondaryIds = activeAreaRecord ? activeAreaRecord.modules || [] : quickIds;
    const secondaryModules = secondaryIds
      .map((id) => OSM.modules.find((module) => module.id === id))
      .filter(Boolean);

    return `
      <div class="context-tabs__primary">
        <a class="context-tab ${activeId === "dashboard" ? "is-active" : ""}" href="#dashboard">Hauptseite</a>
        ${areas.map((area) => `
          <a class="context-tab ${activeArea === area.id ? "is-active" : ""}" href="#area-${escapeHtml(area.id)}">
            ${escapeHtml(area.title)}
          </a>
        `).join("")}
      </div>
      <div class="context-tabs__secondary">
        <span class="context-tabs__label">${activeAreaRecord ? escapeHtml(activeAreaRecord.title) : "Schnellstart"}</span>
        ${secondaryModules.map((module) => `
          <a class="sub-tab ${module.id === activeId ? "is-active" : ""}" href="#${module.id}">
            <span>${escapeHtml(module.icon || areaInitial({ title: module.title }))}</span>
            ${escapeHtml(module.title)}
          </a>
        `).join("")}
      </div>
    `;
  }

  function render() {
    const module = currentModule();
    document.body.dataset.view = module.id === "dashboard" ? "dashboard" : "module";
    document.querySelector('[data-region="nav"]').innerHTML = renderNav(module.id);
    document.querySelector('[data-region="content"]').innerHTML = module.render
      ? module.render(OSM.data, helpers)
      : renderGeneric(module);
    document.title = `${module.title} - OS.MECHPLAST ERP`;
    updateSaveStatus();
  }

  function renderGeneric(module) {
    const rows = OSM.data[module.collection] || [];
    const filteredRows = rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return `
      ${renderTopbar(module)}
      ${renderRelatedModules(module)}
      <div class="toolbar">
        <input class="search" data-action="search" value="${escapeHtml(searchTerm)}" placeholder="Suchen..." />
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
              <a href="#dashboard">Hauptseite</a>
              ${area ? `<span>/</span><a href="#area-${escapeHtml(area.id)}">${escapeHtml(area.title)}</a>` : ""}
            </div>
          ` : ""}
          <h1 class="topbar__title">${escapeHtml(module.title)}</h1>
          <p class="topbar__text">${escapeHtml(module.description || "")}</p>
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
        ${relatedModules.slice(0, 7).map((item) => `<a href="#${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>`).join("")}
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
                    <button class="icon-button" data-action="edit" data-module="${module.id}" data-id="${row.id}">Bearbeiten</button>
                    <button class="icon-button icon-button--danger" data-action="delete" data-module="${module.id}" data-id="${row.id}">Löschen</button>
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
    if (action === "export-data") exportData();
    if (action === "import-data") document.getElementById("import-file").click();
    if (action === "reset-demo") resetDemoData();
  }

  function handleInput(event) {
    if (event.target.dataset.action !== "search") return;
    searchTerm = event.target.value;
    render();
    const input = document.querySelector('[data-action="search"]');
    if (input) input.focus();
  }

  function handleChange(event) {
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

  function openForm(moduleId, id) {
    const module = OSM.modules.find((item) => item.id === moduleId);
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
    const value = record[field.key] ?? field.default ?? "";
    const wide = field.type === "textarea" || field.wide ? " form-field--wide" : "";
    const required = field.required ? " required" : "";
    let control = "";

    if (field.type === "textarea") {
      control = `<textarea name="${field.key}"${required}>${escapeHtml(value)}</textarea>`;
    } else if (field.type === "select") {
      const choices = typeof field.options === "function" ? field.options(OSM.data, helpers) : field.options || [];
      control = `
        <select name="${field.key}"${required}>
          <option value="">-</option>
          ${choices.map((option) => `
            <option value="${escapeHtml(option.value)}" ${String(value) === String(option.value) ? "selected" : ""}>
              ${escapeHtml(displayText(option.label))}
            </option>
          `).join("")}
        </select>
      `;
    } else {
      control = `<input name="${field.key}" type="${field.type || "text"}" value="${escapeHtml(value)}"${required} />`;
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
  OSM.helpers = helpers;
})();
