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

  function badge(value, tone) {
    const className = tone ? `badge badge--${tone}` : "badge";
    return `<span class="${className}">${escapeHtml(value || "-")}</span>`;
  }

  function toneForStatus(status) {
    if ([
      "aktiv", "gewonnen", "geliefert", "fertig", "anbieten", "freigegeben",
      "gebucht", "bezahlt", "erhalten", "verfuegbar", "abgeschlossen", "bestaetigt",
      "reserviert", "genehmigt", "bereit"
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
    badge,
    toneForStatus,
    label,
    options,
    decision: (rfq) => OSM.state.capacityDecision(OSM.data, rfq)
  };

  function areaTools() {
    return window.OSM_AREA_TOOLS || {};
  }

  function start() {
    OSM.data = OSM.state.load();
    document.getElementById("app").innerHTML = `
      <div class="shell">
        <aside class="sidebar">
          <div class="brand">
            <div class="brand__eyebrow">OS.MECHPLAST SRLS</div>
            <div class="brand__title">Management ERP</div>
            <div class="brand__subtitle">Lokal, modular, CNC-fokussiert</div>
          </div>
          <nav class="nav" data-region="nav"></nav>
        </aside>
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
    render();
  }

  function currentModule() {
    const id = (location.hash || "#dashboard").replace("#", "");
    return OSM.modules.find((module) => module.id === id) || OSM.modules[0];
  }

  function groupedModules() {
    return OSM.modules.filter((module) => !module.hideInNav).reduce((groups, module) => {
      const group = module.group || "Sonstiges";
      groups[group] = groups[group] || [];
      groups[group].push(module);
      return groups;
    }, {});
  }

  function renderNav(activeId) {
    const groups = groupedModules();
    return Object.keys(groups)
      .map((group) => `
        <div class="nav-group">
          <div class="nav-group__title">${escapeHtml(group)}</div>
          ${groups[group].map((module) => `
            <a class="nav-link ${module.id === activeId ? "is-active" : ""}" href="#${module.id}">
              <span class="nav-link__icon">${escapeHtml(module.icon || "")}</span>
              <span>${escapeHtml(module.title)}</span>
            </a>
          `).join("")}
        </div>
      `)
      .join("");
  }

  function render() {
    const module = currentModule();
    document.querySelector('[data-region="nav"]').innerHTML = renderNav(module.id);
    document.querySelector('[data-region="content"]').innerHTML = module.render
      ? module.render(OSM.data, helpers)
      : renderGeneric(module);
    document.title = `${module.title} - OS.MECHPLAST ERP`;
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
        <div class="muted small">${filteredRows.length} Eintraege</div>
      </div>
      <section class="panel">
        ${filteredRows.length ? renderTable(module, filteredRows) : `<div class="empty">Noch keine Eintraege in diesem Modul.</div>`}
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
          ${!isDashboard ? `<a class="button button--quiet" href="${area ? `#area-${escapeHtml(area.id)}` : "#dashboard"}">Zurueck</a>` : ""}
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
              ${module.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${module.columns.map((column) => `
                  <td>${column.render ? column.render(row, OSM.data, helpers) : escapeHtml(row[column.key])}</td>
                `).join("")}
                <td>
                  <div class="row-actions">
                    <button class="icon-button" data-action="edit" data-module="${module.id}" data-id="${row.id}">Edit</button>
                    <button class="icon-button" data-action="delete" data-module="${module.id}" data-id="${row.id}">Del</button>
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
        alert("Import erledigt.");
      } catch (error) {
        alert("Import nicht moeglich. Bitte eine gueltige JSON-Backup-Datei waehlen.");
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
            <div class="modal__title">${existing ? "Eintrag bearbeiten" : "Neuer Eintrag"}: ${escapeHtml(module.title)}</div>
            <button class="icon-button" data-action="close-modal">Schliessen</button>
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
              ${escapeHtml(option.label)}
            </option>
          `).join("")}
        </select>
      `;
    } else {
      control = `<input name="${field.key}" type="${field.type || "text"}" value="${escapeHtml(value)}"${required} />`;
    }

    return `
      <div class="form-field${wide}">
        <label>${escapeHtml(field.label)}</label>
        ${control}
      </div>
    `;
  }

  function deleteRecord(moduleId, id) {
    const module = OSM.modules.find((item) => item.id === moduleId);
    if (!confirm("Diesen Eintrag wirklich loeschen?")) return;
    OSM.state.remove(OSM.data, module.collection, id);
    render();
  }

  function closeModal() {
    const modal = document.querySelector("[data-modal]");
    if (modal) modal.remove();
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
    if (!confirm("Demo-Daten wiederherstellen? Eigene lokale Aenderungen werden ersetzt.")) return;
    OSM.data = OSM.state.reset();
    render();
  }

  OSM.start = start;
  OSM.render = render;
  OSM.helpers = helpers;
})();
