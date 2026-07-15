(function () {
  const statusOptions = [
    { value: "neu", label: "Nicht begonnen", tone: "neutral" },
    { value: "in arbeit", label: "In Bearbeitung", tone: "active" },
    { value: "wartet", label: "Wartet", tone: "waiting" },
    { value: "blockiert", label: "Blockiert", tone: "blocked" },
    { value: "erledigt", label: "Fertig", tone: "done" }
  ];

  const priorityOptions = [
    { value: "niedrig", label: "Niedrig" },
    { value: "mittel", label: "Mittel" },
    { value: "hoch", label: "Hoch" },
    { value: "kritisch", label: "Kritisch" }
  ];

  const areaOptions = [
    "Management",
    "Vertrieb",
    "Fertigung",
    "Arbeitsvorbereitung",
    "Einkauf",
    "Lager",
    "Qualität",
    "Marketing / SEO",
    "Personal",
    "Finanzen",
    "System"
  ].map((value) => ({ value, label: value }));

  let searchTerm = "";
  let mineOnly = false;
  let areaFilter = "";

  function currentUserId() {
    return window.OSM.state.currentUserId(window.OSM.data);
  }

  function viewStorageKey() {
    return `osm-task-view-${currentUserId()}`;
  }

  function taskView() {
    return localStorage.getItem(viewStorageKey()) || "board";
  }

  function refresh(focusSelector) {
    window.dispatchEvent(new Event("hashchange"));
    if (!focusSelector) return;
    requestAnimationFrame(() => {
      const element = document.querySelector(focusSelector);
      if (element) {
        element.focus();
        if (typeof element.setSelectionRange === "function") {
          element.setSelectionRange(element.value.length, element.value.length);
        }
      }
    });
  }

  function statusLabel(value) {
    const option = statusOptions.find((item) => item.value === value);
    return option ? option.label : value || "-";
  }

  function userInitials(name) {
    return String(name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function formatDate(value) {
    if (!value) return "Kein Datum";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function isOverdue(task) {
    if (!task.dueDate || task.status === "erledigt") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${task.dueDate}T00:00:00`) < today;
  }

  function seoImportPackage() {
    return window.OSM_SEO_TASK_IMPORT && Array.isArray(window.OSM_SEO_TASK_IMPORT.tasks)
      ? window.OSM_SEO_TASK_IMPORT
      : null;
  }

  function seoImportedTasks(data) {
    const pack = seoImportPackage();
    if (!pack) return [];
    return (data.tasks || []).filter((task) => task.sourcePackage === pack.id || String(task.id || "").startsWith("tsk_seo_"));
  }

  function mapSeoStatus(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (["erledigt", "done", "fertig", "abgeschlossen"].includes(normalized)) return "erledigt";
    if (["in arbeit", "in bearbeitung", "läuft", "laufend"].includes(normalized)) return "in arbeit";
    if (["wartet", "waiting"].includes(normalized)) return "wartet";
    if (["blockiert", "blocked"].includes(normalized)) return "blockiert";
    return "neu";
  }

  function mapSeoPriority(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized.includes("sehr hoch") || normalized.includes("kritisch")) return "kritisch";
    if (normalized.includes("hoch")) return "hoch";
    if (normalized.includes("niedrig")) return "niedrig";
    return "mittel";
  }

  function responsibleUserId(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized.includes("mohammed")) return "usr_mohammed";
    if (normalized.includes("abdelaziz")) return "usr_abdelaziz";
    return currentUserId();
  }

  function joinSections(sections) {
    return sections
      .filter((section) => section && section.value)
      .map((section) => `${section.label}: ${section.value}`)
      .join("\n\n");
  }

  function ensureSeoProject(data) {
    data.projects = data.projects || [];
    const existing = data.projects.find((project) => project.id === "pro_seo_website_100");
    const next = {
      id: "pro_seo_website_100",
      name: "SEO Website 100-%-Plan",
      customerId: "cus_internal",
      status: "aktiv",
      priority: "hoch",
      owner: "OS.MECHPLAST",
      progress: 0,
      notes: "Importiert aus OSMECHPLAST_SEO_100_Prozent_Plan.xlsx."
    };
    if (existing) {
      Object.assign(existing, next);
      return;
    }
    data.projects.push(next);
  }

  function buildSeoTask(source, existing) {
    const description = joinSections([
      { label: "Kategorie", value: [source.level1, source.level2, source.level3].filter(Boolean).join(" / ") },
      { label: "Audit-Befund", value: source.auditFinding },
      { label: "Ziel / Abnahmekriterium", value: source.acceptance },
      { label: "Umsetzungsschritte", value: source.steps }
    ]);
    const notes = joinSections([
      { label: "SEO Task-ID", value: source.sourceTaskId },
      { label: "Prompt-ID", value: source.promptId },
      { label: "Abhängigkeit", value: source.dependency },
      { label: "Gewicht am Gesamtplan", value: source.weight },
      { label: "Nachweis / Ergebnis", value: source.proof },
      { label: "Quelle", value: "OSMECHPLAST_SEO_100_Prozent_Plan.xlsx" },
      { label: "Notizen", value: source.notes }
    ]);
    const comments = source.codexPrompt
      ? joinSections([
        { label: "Codex-Prompt", value: source.codexPrompt },
        { label: "Erwartete Abschlussausgabe", value: source.expectedOutput }
      ])
      : existing && existing.comments || "";

    return Object.assign({}, existing || {}, {
      id: source.id,
      title: source.title,
      description,
      area: "Marketing / SEO",
      priority: existing && existing.priority ? existing.priority : mapSeoPriority(source.priority),
      status: existing && existing.status ? existing.status : mapSeoStatus(source.excelStatus),
      assignedTo: existing && existing.assignedTo ? existing.assignedTo : responsibleUserId(source.responsible),
      createdBy: existing && existing.createdBy ? existing.createdBy : currentUserId(),
      projectId: "pro_seo_website_100",
      customerId: existing && existing.customerId ? existing.customerId : "cus_internal",
      orderId: existing && existing.orderId ? existing.orderId : "",
      dueDate: existing && existing.dueDate ? existing.dueDate : "",
      comments: existing && existing.comments ? existing.comments : comments,
      notes,
      sourcePackage: "osmechplast-seo-100-plan",
      sourceTaskId: source.sourceTaskId,
      sourcePromptId: source.promptId,
      sourceLevel1: source.level1,
      sourceLevel2: source.level2,
      sourceLevel3: source.level3,
      sourceWeight: source.weight
    });
  }

  function importSeoTasks() {
    const pack = seoImportPackage();
    if (!pack) {
      alert("SEO-Importpaket wurde nicht gefunden.");
      return;
    }

    const data = window.OSM.data;
    const now = new Date().toISOString();
    const userName = window.OSM.state.currentUser(data);
    let created = 0;
    let updated = 0;
    data.tasks = data.tasks || [];
    ensureSeoProject(data);

    pack.tasks.forEach((source) => {
      const index = data.tasks.findIndex((task) => task.id === source.id || task.sourceTaskId === source.sourceTaskId);
      const existing = index >= 0 ? data.tasks[index] : null;
      const next = Object.assign(buildSeoTask(source, existing), {
        createdAt: existing && existing.createdAt ? existing.createdAt : now,
        updatedAt: now,
        updatedBy: userName,
        importedAt: existing && existing.importedAt ? existing.importedAt : now
      });
      if (!existing) {
        next.history = [
          `${new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(now))} ${userName}: aus SEO-Excel-Plan importiert`,
          next.history || ""
        ].filter(Boolean).join("\n");
        data.tasks.push(next);
        created += 1;
      } else {
        data.tasks[index] = next;
        updated += 1;
      }
    });

    data.auditLogs = data.auditLogs || [];
    data.auditLogs.unshift({
      id: window.OSM.state.uid("aud"),
      timestamp: now,
      user: userName,
      collection: "tasks",
      recordId: pack.id,
      action: "importiert",
      summary: `SEO-Plan importiert/aktualisiert: ${created} neu, ${updated} aktualisiert`
    });
    data.auditLogs = data.auditLogs.slice(0, 250);
    window.OSM.state.save(data, { summary: `SEO-Plan importiert/aktualisiert: ${created} neu, ${updated} aktualisiert` });
    areaFilter = "Marketing / SEO";
    alert(`SEO-Plan importiert.\nNeu: ${created}\nAktualisiert: ${updated}`);
  }

  function renderSeoImportPanel(data, h) {
    const pack = seoImportPackage();
    if (!pack) return "";
    const imported = seoImportedTasks(data);
    const done = imported.filter((task) => task.status === "erledigt").length;
    const open = imported.filter((task) => task.status !== "erledigt").length;
    const progress = imported.length ? Math.round((done / imported.length) * 100) : 0;
    const label = imported.length ? "SEO-Plan aktualisieren" : "SEO-Plan importieren";

    return `
      <section class="task-import-panel">
        <div class="task-import-panel__main">
          <span class="task-import-panel__eyebrow">Importpaket</span>
          <strong>${h.escapeHtml(pack.title)}</strong>
          <span>${h.escapeHtml(pack.taskCount)} Aufgaben aus Excel. Importierte Aufgaben bleiben normale ERP-Aufgaben mit Status, Zuständigem, Historie und Dashboard-Zählung.</span>
        </div>
        <div class="task-import-panel__stats" aria-label="SEO Import Status">
          <span><strong>${h.escapeHtml(imported.length)}</strong> im ERP</span>
          <span><strong>${h.escapeHtml(open)}</strong> offen</span>
          <span><strong>${h.escapeHtml(progress)}%</strong> erledigt</span>
        </div>
        <div class="task-import-panel__actions">
          <button class="button" type="button" data-seo-import>${h.escapeHtml(label)}</button>
          ${imported.length ? `<button class="button button--quiet" type="button" data-seo-filter>SEO-Aufgaben anzeigen</button>` : ""}
        </div>
      </section>
    `;
  }

  function sortedTasks(rows) {
    return rows.slice().sort((left, right) => {
      if (!left.dueDate && !right.dueDate) return String(left.title || "").localeCompare(String(right.title || ""), "de");
      if (!left.dueDate) return 1;
      if (!right.dueDate) return -1;
      return left.dueDate.localeCompare(right.dueDate);
    });
  }

  function statusSelect(task, h, className) {
    return `
      <select class="${className || "task-status-select"}" data-task-status="${h.escapeHtml(task.id)}" aria-label="Status von ${h.escapeHtml(task.title)} ändern">
        ${statusOptions.map((option) => `
          <option value="${h.escapeHtml(option.value)}" ${task.status === option.value ? "selected" : ""}>${h.escapeHtml(option.label)}</option>
        `).join("")}
      </select>
    `;
  }

  function renderTaskCard(task, data, h) {
    const assignee = h.label("users", task.assignedTo);
    const customer = task.customerId ? h.label("customers", task.customerId) : "";
    return `
      <article class="notion-task-card ${isOverdue(task) ? "is-overdue" : ""}">
        <div class="notion-task-card__head">
          <button class="notion-task-card__title" type="button" data-action="edit" data-module="tasks" data-id="${h.escapeHtml(task.id)}">
            ${h.escapeHtml(h.displayText(task.title || "Ohne Titel"))}
          </button>
          <button class="task-delete-x" type="button" title="Aufgabe löschen" aria-label="Aufgabe löschen" data-action="delete" data-module="tasks" data-id="${h.escapeHtml(task.id)}">&times;</button>
        </div>
        ${task.description ? `<p class="notion-task-card__description">${h.escapeHtml(task.description)}</p>` : ""}
        <div class="notion-task-card__properties">
          <span class="task-property task-property--area">${h.escapeHtml(task.area || "Management")}</span>
          <span class="task-property task-property--${h.escapeHtml(task.priority || "mittel")}">${h.escapeHtml(h.displayText(task.priority || "mittel"))}</span>
          ${customer && customer !== "-" ? `<span class="task-property">${h.escapeHtml(customer)}</span>` : ""}
        </div>
        <div class="notion-task-card__foot">
          <span class="task-assignee" title="${h.escapeHtml(assignee)}">
            <span class="task-avatar">${h.escapeHtml(userInitials(assignee))}</span>
            <span>${h.escapeHtml(assignee)}</span>
          </span>
          <span class="task-due ${isOverdue(task) ? "is-overdue" : ""}">${h.escapeHtml(formatDate(task.dueDate))}</span>
        </div>
        <div class="notion-task-card__status">${statusSelect(task, h)}</div>
      </article>
    `;
  }

  function renderBoard(rows, data, h) {
    return `
      <div class="notion-task-board">
        ${statusOptions.map((column) => {
          const tasks = sortedTasks(rows.filter((task) => task.status === column.value));
          return `
            <section class="notion-task-column notion-task-column--${h.escapeHtml(column.tone)}">
              <div class="notion-task-column__head">
                <span class="notion-status notion-status--${h.escapeHtml(column.tone)}"><i></i>${h.escapeHtml(column.label)}</span>
                <span class="notion-task-column__count">${tasks.length}</span>
              </div>
              <div class="notion-task-column__cards">
                ${tasks.map((task) => renderTaskCard(task, data, h)).join("")}
              </div>
              <button class="notion-add-task" type="button" data-action="add" data-module="tasks" data-default-status="${h.escapeHtml(column.value)}">
                <span>+</span> Neue Aufgabe
              </button>
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderList(rows, data, h) {
    return `
      <section class="notion-task-list">
        ${rows.length ? `
          <div class="table-wrap">
            <table class="notion-task-table">
              <thead>
                <tr>
                  <th>Aufgabe</th>
                  <th>Status</th>
                  <th>Bereich</th>
                  <th>Priorität</th>
                  <th>Zuständig</th>
                  <th>Fällig</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${sortedTasks(rows).map((task) => {
                  const assignee = h.label("users", task.assignedTo);
                  return `
                    <tr>
                      <td>
                        <button class="notion-task-title-link" type="button" data-action="edit" data-module="tasks" data-id="${h.escapeHtml(task.id)}">
                          <span class="notion-check">${task.status === "erledigt" ? "✓" : ""}</span>
                          ${h.escapeHtml(h.displayText(task.title || "Ohne Titel"))}
                        </button>
                      </td>
                      <td>${statusSelect(task, h, "task-status-select task-status-select--table")}</td>
                      <td>${h.escapeHtml(task.area || "Management")}</td>
                      <td><span class="task-property task-property--${h.escapeHtml(task.priority || "mittel")}">${h.escapeHtml(h.displayText(task.priority || "mittel"))}</span></td>
                      <td><span class="task-assignee"><span class="task-avatar">${h.escapeHtml(userInitials(assignee))}</span>${h.escapeHtml(assignee)}</span></td>
                      <td><span class="task-due ${isOverdue(task) ? "is-overdue" : ""}">${h.escapeHtml(formatDate(task.dueDate))}</span></td>
                      <td><button class="task-delete-x" type="button" title="Aufgabe löschen" aria-label="Aufgabe löschen" data-action="delete" data-module="tasks" data-id="${h.escapeHtml(task.id)}">&times;</button></td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty">Keine Aufgaben für diese Auswahl.</div>`}
      </section>
    `;
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-task-view]");
    if (target) {
      localStorage.setItem(viewStorageKey(), target.dataset.taskView);
      refresh();
      return;
    }

    const mineButton = event.target.closest("[data-task-mine]");
    if (mineButton) {
      mineOnly = !mineOnly;
      refresh();
      return;
    }

    const addButton = event.target.closest('[data-action="add"][data-module="tasks"][data-default-status]');
    if (addButton) {
      const defaultStatus = addButton.dataset.defaultStatus;
      setTimeout(() => {
        const statusField = document.querySelector('[data-form-module="tasks"] [name="status"]');
        if (statusField) statusField.value = defaultStatus;
      }, 0);
      return;
    }

    const seoImportButton = event.target.closest("[data-seo-import]");
    if (seoImportButton) {
      importSeoTasks();
      refresh();
      return;
    }

    const seoFilterButton = event.target.closest("[data-seo-filter]");
    if (seoFilterButton) {
      areaFilter = "Marketing / SEO";
      refresh();
    }
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-task-search]")) return;
    searchTerm = event.target.value;
    refresh("[data-task-search]");
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-task-area]")) {
      areaFilter = event.target.value;
      refresh();
      return;
    }

    const taskId = event.target.dataset.taskStatus;
    if (!taskId) return;
    window.OSM.state.upsert(window.OSM.data, "tasks", {
      id: taskId,
      status: event.target.value
    });
    refresh();
  });

  window.OSM.registerModule({
    id: "tasks",
    group: "Management",
    icon: "A",
    title: "Aufgaben",
    description: "Aufgaben planen, zuweisen und gemeinsam bearbeiten.",
    collection: "tasks",
    prefix: "tsk",
    fields: [
      { key: "title", label: "Titel", required: true },
      { key: "description", label: "Beschreibung", type: "textarea", wide: true },
      { key: "area", label: "Bereich", type: "select", options: areaOptions, default: "Management" },
      { key: "priority", label: "Priorität", type: "select", options: priorityOptions, default: "mittel" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "neu" },
      { key: "assignedTo", label: "Zuständig", type: "select", options: (data, h) => h.options("users"), required: true },
      { key: "createdBy", label: "Erstellt von", type: "select", options: (data, h) => h.options("users"), default: () => currentUserId() },
      { key: "dueDate", label: "Fälligkeitsdatum", type: "date" },
      { key: "projectId", label: "Projekt", type: "select", options: (data, h) => h.options("projects") },
      { key: "customerId", label: "Kunde optional", type: "select", options: (data, h) => h.options("customers") },
      { key: "orderId", label: "Auftrag optional", type: "select", options: (data, h) => h.options("orders", "orderNo") },
      { key: "comments", label: "Kommentarverlauf", type: "textarea", wide: true },
      { key: "history", label: "Historie", type: "textarea", wide: true }
    ],
    columns: [
      { key: "title", label: "Aufgabe" },
      { key: "area", label: "Bereich" },
      { key: "priority", label: "Priorität" },
      { key: "status", label: "Status" },
      { key: "assignedTo", label: "Zuständig" },
      { key: "dueDate", label: "Fällig" }
    ],
    render(data, h) {
      const allRows = data.tasks || [];
      const currentId = currentUserId();
      const areas = Array.from(new Set(allRows.map((task) => task.area).filter(Boolean))).sort((a, b) => a.localeCompare(b, "de"));
      const filteredRows = allRows.filter((task) => {
        const matchesSearch = !searchTerm || JSON.stringify(task).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOwner = !mineOnly || task.assignedTo === currentId;
        const matchesArea = !areaFilter || task.area === areaFilter;
        return matchesSearch && matchesOwner && matchesArea;
      });
      const open = allRows.filter((task) => task.status !== "erledigt").length;
      const mine = allRows.filter((task) => task.assignedTo === currentId && task.status !== "erledigt").length;
      const blocked = allRows.filter((task) => task.status === "blockiert").length;
      const mode = taskView();

      return `
        <div class="notion-task-page">
          <div class="notion-task-titlebar">
            <div>
              <div class="breadcrumb"><a href="#dashboard">Start</a><span>/</span><a href="#area-management">Management</a></div>
              <h1><span class="notion-title-icon">✓</span> Aufgaben</h1>
            </div>
            <button class="button button--blue" data-action="add" data-module="tasks">Neu <span aria-hidden="true">+</span></button>
          </div>

          <div class="notion-task-summary">
            <span><strong>${open}</strong> offen</span>
            <span><strong>${mine}</strong> für mich</span>
            <span class="${blocked ? "is-critical" : ""}"><strong>${blocked}</strong> blockiert</span>
          </div>

          ${renderSeoImportPanel(data, h)}

          <div class="notion-task-toolbar">
            <div class="notion-view-tabs" role="tablist" aria-label="Aufgabenansicht">
              <button class="${mode === "board" ? "is-active" : ""}" type="button" data-task-view="board"><span class="notion-view-icon">▥</span> Board</button>
              <button class="${mode === "list" ? "is-active" : ""}" type="button" data-task-view="list"><span class="notion-view-icon">▤</span> Alle</button>
            </div>
            <div class="notion-task-filters">
              <label class="notion-task-search">
                <span aria-hidden="true">⌕</span>
                <input type="search" value="${h.escapeHtml(searchTerm)}" data-task-search placeholder="Aufgaben suchen" aria-label="Aufgaben suchen" />
              </label>
              <select data-task-area aria-label="Nach Bereich filtern">
                <option value="">Alle Bereiche</option>
                ${areas.map((area) => `<option value="${h.escapeHtml(area)}" ${area === areaFilter ? "selected" : ""}>${h.escapeHtml(area)}</option>`).join("")}
              </select>
              <button class="notion-filter-button ${mineOnly ? "is-active" : ""}" type="button" data-task-mine>Mir zugewiesen</button>
            </div>
          </div>

          ${mode === "board" ? renderBoard(filteredRows, data, h) : renderList(filteredRows, data, h)}
        </div>
      `;
    }
  });
})();
