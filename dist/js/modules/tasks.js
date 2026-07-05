(function () {
  const statusOptions = [
    { value: "neu", label: "Neu" },
    { value: "in arbeit", label: "In Arbeit" },
    { value: "wartet", label: "Wartet" },
    { value: "erledigt", label: "Erledigt" },
    { value: "blockiert", label: "Blockiert" }
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
    "Personal",
    "Finanzen",
    "System"
  ].map((value) => ({ value, label: value }));

  window.OSM.registerModule({
    id: "tasks",
    group: "Management",
    icon: "A",
    title: "Aufgaben",
    description: "Aufgaben mit Zuständigkeit, Kommentarverlauf und Änderungshistorie.",
    collection: "tasks",
    prefix: "tsk",
    fields: [
      { key: "title", label: "Titel", required: true },
      { key: "description", label: "Beschreibung", type: "textarea", wide: true },
      { key: "area", label: "Bereich", type: "select", options: areaOptions, default: "Management" },
      { key: "priority", label: "Priorität", type: "select", options: priorityOptions, default: "mittel" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "neu" },
      { key: "assignedTo", label: "Zuständig", type: "select", options: (data, h) => h.options("users"), required: true },
      { key: "createdBy", label: "Erstellt von", type: "select", options: (data, h) => h.options("users"), default: (window.OSM && window.OSM.state && window.OSM.data) ? window.OSM.state.currentUserId(window.OSM.data) : "usr_abdelaziz" },
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
      { key: "priority", label: "Priorität", render: (row, data, h) => h.badge(row.priority, h.toneForStatus(row.priority)) },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "assignedTo", label: "Zuständig", render: (row, data, h) => h.escapeHtml(h.label("users", row.assignedTo)) },
      { key: "createdBy", label: "Erstellt von", render: (row, data, h) => h.escapeHtml(h.label("users", row.createdBy)) },
      { key: "dueDate", label: "Fällig" },
      { key: "customerId", label: "Kunde", render: (row, data, h) => h.escapeHtml(h.label("customers", row.customerId)) }
    ],
    render(data, h) {
      const rows = data.tasks || [];
      const open = rows.filter((task) => task.status !== "erledigt").length;
      const blocked = rows.filter((task) => task.status === "blockiert").length;
      const currentUserId = window.OSM.state.currentUserId(data);
      const mine = rows.filter((task) => task.assignedTo === currentUserId && task.status !== "erledigt").length;

      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Start</a>
              <span>/</span>
              <a href="#area-management">Management</a>
            </div>
            <h1 class="topbar__title">Aufgaben</h1>
            <p class="topbar__text">Super Admins können Aufgaben erstellen, bearbeiten, löschen und sich selbst oder anderen zuweisen.</p>
          </div>
          <div class="page-actions">
            <button class="button" data-action="add" data-module="tasks">+ Aufgabe</button>
          </div>
        </div>

        <div class="grid grid--stats">
          <div class="stat"><span class="stat__label">Offen</span><strong class="stat__value">${h.escapeHtml(open)}</strong></div>
          <div class="stat"><span class="stat__label">Meine offenen Aufgaben</span><strong class="stat__value">${h.escapeHtml(mine)}</strong></div>
          <div class="stat"><span class="stat__label">Blockiert</span><strong class="stat__value">${h.escapeHtml(blocked)}</strong></div>
          <div class="stat"><span class="stat__label">Gesamt</span><strong class="stat__value">${h.escapeHtml(rows.length)}</strong></div>
        </div>

        <section class="panel">
          ${rows.length ? `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    ${this.columns.map((column) => `<th>${h.escapeHtml(column.label)}</th>`).join("")}
                    <th class="task-delete-col"></th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((row) => `
                    <tr class="task-row">
                      ${this.columns.map((column) => `<td>${column.render ? column.render(row, data, h) : h.escapeHtml(h.displayText(row[column.key]))}</td>`).join("")}
                      <td class="task-row__actions">
                        <button class="task-delete-x" type="button" title="Aufgabe löschen" aria-label="Aufgabe löschen" data-action="delete" data-module="tasks" data-id="${h.escapeHtml(row.id)}">&times;</button>
                        <div class="row-actions task-row__edit-actions">
                          <button class="icon-button" data-action="edit" data-module="tasks" data-id="${h.escapeHtml(row.id)}">Bearbeiten</button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty">Noch keine Aufgaben.</div>`}
        </section>
      `;
    }
  });
})();
