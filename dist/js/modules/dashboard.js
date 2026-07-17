(function () {
  const defaultLayouts = {
    usr_abdelaziz: ["overview", "salesFunnel", "tasks", "sales", "capacity", "audit", "quickLinks"],
    usr_mohammed: ["overview", "salesFunnel", "tasks", "production", "quality", "map", "quickLinks"]
  };

  function count(collection, data, filter) {
    const rows = data[collection] || [];
    return filter ? rows.filter(filter).length : rows.length;
  }

  function userId(data) {
    return window.OSM.state.currentUserId(data);
  }

  function userName(data) {
    const user = window.OSM.state.currentUserRecord(data);
    return user ? user.name : "Abdelaziz";
  }

  function normalizeLayout(data) {
    data.meta = data.meta || {};
    data.meta.dashboardLayouts = data.meta.dashboardLayouts || {};
    const currentUserId = userId(data);
    const defaults = defaultLayouts[currentUserId] || defaultLayouts.usr_abdelaziz;
    if (!Array.isArray(data.meta.dashboardLayouts[currentUserId])) {
      data.meta.dashboardLayouts[currentUserId] = defaults.map((id) => ({ id, visible: true }));
    }

    const known = new Set(widgetDefinitions().map((widget) => widget.id));
    data.meta.dashboardLayouts[currentUserId] = data.meta.dashboardLayouts[currentUserId]
      .filter((item) => item && known.has(item.id))
      .map((item) => ({ id: item.id, visible: item.visible !== false }));

    defaults.forEach((id) => {
      if (!data.meta.dashboardLayouts[currentUserId].some((item) => item.id === id)) {
        data.meta.dashboardLayouts[currentUserId].push({ id, visible: true });
      }
    });

    widgetDefinitions().forEach((widget) => {
      if (!data.meta.dashboardLayouts[currentUserId].some((item) => item.id === widget.id)) {
        data.meta.dashboardLayouts[currentUserId].push({ id: widget.id, visible: false });
      }
    });

    return data.meta.dashboardLayouts[currentUserId];
  }

  function widgetDefinitions() {
    return [
      { id: "overview", title: "Überblick", render: renderOverview },
      { id: "salesFunnel", title: "Vertriebswege", render: renderSalesFunnel },
      { id: "tasks", title: "Aufgaben", render: renderTasks },
      { id: "sales", title: "Vertrieb", render: renderSales },
      { id: "capacity", title: "Kapazität", render: renderCapacity },
      { id: "production", title: "Fertigung", render: renderProduction },
      { id: "quality", title: "Qualität", render: renderQuality },
      { id: "map", title: "Karte", render: renderMap },
      { id: "audit", title: "Änderungen", render: renderAudit },
      { id: "quickLinks", title: "Schnellzugriff", render: renderQuickLinks }
    ];
  }

  function metric(label, value, href, h, tone) {
    return `
      <a class="metric-card metric-card--link ${tone ? `metric-card--${tone}` : ""}" href="${h.escapeHtml(href)}">
        <span>${h.escapeHtml(label)}</span>
        <strong>${h.escapeHtml(value)}</strong>
      </a>
    `;
  }

  function widgetShell(widget, index, total, content, h) {
    return `
      <section class="dashboard-widget" data-widget="${h.escapeHtml(widget.id)}">
        <div class="dashboard-widget__head">
          <h2>${h.escapeHtml(widget.title)}</h2>
          <div class="widget-actions">
            <button type="button" data-action="widget-up" data-widget="${h.escapeHtml(widget.id)}" ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" data-action="widget-down" data-widget="${h.escapeHtml(widget.id)}" ${index === total - 1 ? "disabled" : ""}>↓</button>
            <button type="button" data-action="widget-hide" data-widget="${h.escapeHtml(widget.id)}">Ausblenden</button>
          </div>
        </div>
        ${content}
      </section>
    `;
  }

  function salesPathStats(data) {
    const paths = data.sales_paths || [];
    const events = data.sales_path_events || [];
    const today = new Date().toISOString().slice(0, 10);
    const active = paths.filter((path) => path.is_active !== false);
    const completed = paths.filter((path) => path.is_active === false);
    const eventCount = (pathType, labels) => events.filter((event) =>
      (!pathType || event.path_type === pathType) && labels.includes(event.selected_result)
    ).length;
    const statusCount = (pathType, statuses) => paths.filter((path) =>
      (!pathType || path.path_type === pathType) && statuses.includes(path.status)
    ).length;
    const customerName = (customerId) => {
      const customer = (data.customers || []).find((item) => item.id === customerId);
      return customer ? customer.name : "Kunde";
    };
    const nextItems = active
      .filter((path) => path.next_action)
      .sort((a, b) => String(a.next_action_due || "9999-12-31").localeCompare(String(b.next_action_due || "9999-12-31")))
      .slice(0, 6)
      .map((path) => ({
        id: path.id,
        customer: customerName(path.customer_id),
        action: path.next_action,
        due: path.next_action_due || "kein Datum",
        type: path.path_type
      }));

    return {
      active: active.length,
      linkedin: active.filter((path) => path.path_type === "linkedin").length,
      phone: active.filter((path) => path.path_type === "phone").length,
      email: active.filter((path) => path.path_type === "email").length,
      direct: active.filter((path) => path.path_type === "direct_contact").length,
      dueToday: active.filter((path) => path.next_action_due === today).length,
      overdue: active.filter((path) => path.next_action_due && path.next_action_due < today).length,
      requests: statusCount(null, ["Anfrage erhalten"]) + eventCount(null, ["Anfrage erhalten", "RFQ / Anfrage anlegen"]),
      meetings: statusCount(null, ["Termin geplant", "Termin gewünscht"]) + eventCount(null, ["Termin geplant", "Termin gewünscht"]),
      completed: completed.length,
      nextItems,
      bars: [
        { label: "LinkedIn Anfrage gesendet", value: eventCount("linkedin", ["Kontaktanfrage gesendet"]) + statusCount("linkedin", ["Anfrage gesendet"]) },
        { label: "LinkedIn vernetzt", value: eventCount("linkedin", ["Ja, angenommen"]) + statusCount("linkedin", ["LinkedIn verbunden"]) },
        { label: "LinkedIn kontaktiert", value: eventCount("linkedin", ["Nachricht gesendet"]) + statusCount("linkedin", ["Nachricht gesendet"]) },
        { label: "Antwort erhalten", value: eventCount(null, ["Antwort erhalten"]) + statusCount(null, ["Antwort erhalten"]) },
        { label: "Telefonwege", value: active.filter((path) => path.path_type === "phone").length },
        { label: "Direktkontakt", value: active.filter((path) => path.path_type === "direct_contact").length }
      ]
    };
  }

  function renderSalesFunnel(data, h) {
    const stats = salesPathStats(data);
    const max = Math.max(1, ...stats.bars.map((bar) => bar.value));
    return `
      <div class="dashboard-metrics">
        ${metric("Aktive Wege", stats.active, "#customers", h)}
        ${metric("Heute fällig", stats.dueToday, "#customers", h, stats.dueToday ? "warn" : "")}
        ${metric("Überfällig", stats.overdue, "#customers", h, stats.overdue ? "danger" : "")}
        ${metric("Anfragen erhalten", stats.requests, "#customers", h)}
      </div>
      <div class="sales-funnel-widget">
        <div class="sales-funnel-bars">
          ${stats.bars.map((bar) => `
            <div class="sales-funnel-bar">
              <div class="sales-funnel-bar__label">
                <span>${h.escapeHtml(bar.label)}</span>
                <strong>${h.escapeHtml(bar.value)}</strong>
              </div>
              <div class="sales-funnel-bar__track">
                <span style="width: ${Math.max(6, Math.round((bar.value / max) * 100))}%"></span>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="sales-funnel-summary">
          <span>${h.escapeHtml(stats.linkedin)} LinkedIn aktiv</span>
          <span>${h.escapeHtml(stats.phone)} Telefon aktiv</span>
          <span>${h.escapeHtml(stats.email)} E-Mail aktiv</span>
          <span>${h.escapeHtml(stats.direct)} Direktkontakte aktiv</span>
          <span>${h.escapeHtml(stats.meetings)} Termine geplant/gewünscht</span>
          <span>${h.escapeHtml(stats.completed)} Wege abgeschlossen</span>
        </div>
        <div class="sales-next-list">
          <div class="widget-subtitle">Nächste Vertriebsaufgaben</div>
          <div class="list">
            ${stats.nextItems.length ? stats.nextItems.map((item) => `
              <a class="list-item list-item--task" href="#customers">
                <span class="list-item__main">
                  <span class="list-item__title">${h.escapeHtml(item.customer)}</span>
                  <span class="list-item__meta">${h.escapeHtml(item.action)} · ${h.escapeHtml(item.due)} · ${h.escapeHtml(item.type)}</span>
                </span>
              </a>
            `).join("") : `<div class="empty">Noch keine Vertriebsaufgaben angelegt.</div>`}
          </div>
        </div>
      </div>
    `;
  }

  function renderOverview(data, h) {
    const currentUserId = userId(data);
    return `
      <div class="dashboard-metrics">
        ${metric("Offene RFQs", count("rfqs", data, (item) => !["abgelehnt", "gewonnen"].includes(item.status)), "#rfqs", h)}
        ${metric("Meine Aufgaben", count("tasks", data, (item) => item.assignedTo === currentUserId && item.status !== "erledigt"), "#tasks", h)}
        ${metric("Offene Aufträge", count("orders", data, (item) => item.status !== "geliefert"), "#orders", h)}
        ${metric("Materialbedarf", count("purchaseRequests", data, (item) => !["erhalten", "storniert"].includes(item.status)), "#purchase-requests", h)}
      </div>
      <div class="notice notice--plain">Abdelaziz und Mohammed sind Super Admins. Dieses Dashboard ist nur persönliche Oberfläche, kein Rechte-System.</div>
    `;
  }

  function taskPlanOrder(task) {
    const explicit = Number(task.sourceOrder || task.sourceSequence || task.planOrder || 0);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const candidates = [task.sourceTaskId, task.sourcePromptId, task.id].filter(Boolean);
    for (const value of candidates) {
      const match = String(value).match(/(?:seo|prompt)[-_ ]?(\d{1,5})/i);
      if (match) return Number(match[1]);
    }
    return null;
  }

  function compareTasks(left, right) {
    const leftPlanOrder = taskPlanOrder(left);
    const rightPlanOrder = taskPlanOrder(right);
    if (leftPlanOrder !== null && rightPlanOrder !== null && leftPlanOrder !== rightPlanOrder) {
      return leftPlanOrder - rightPlanOrder;
    }
    if (leftPlanOrder !== null && rightPlanOrder === null && !right.dueDate) return -1;
    if (leftPlanOrder === null && rightPlanOrder !== null && !left.dueDate) return 1;
    return String(left.dueDate || "9999-12-31").localeCompare(String(right.dueDate || "9999-12-31")) ||
      String(left.title || "").localeCompare(String(right.title || ""), "de");
  }

  function renderTasks(data, h) {
    const currentUserId = userId(data);
    const tasks = (data.tasks || [])
      .filter((task) => task.assignedTo === currentUserId && task.status !== "erledigt")
      .sort(compareTasks)
      .slice(0, 6);
    const ownCount = (data.tasks || []).filter((task) => task.assignedTo === currentUserId && task.status !== "erledigt").length;
    const allOpenCount = (data.tasks || []).filter((task) => task.status !== "erledigt").length;
    return `
      <div class="widget-summary">
        <strong>${h.escapeHtml(ownCount)}</strong>
        <span>offene Aufgaben für ${h.escapeHtml(userName(data))}</span>
        <button class="button" type="button" data-action="add" data-module="tasks">+ Aufgabe</button>
      </div>
      <div class="notice notice--plain">
        PersÃ¶nliche Startseite: Hier erscheinen nur Aufgaben, bei denen ${h.escapeHtml(userName(data))} als zustÃ¤ndig eingetragen ist.
        Alle offenen Aufgaben im System: ${h.escapeHtml(allOpenCount)}.
      </div>
      <div class="list">
        ${tasks.length ? tasks.map((task) => `
          <div class="list-item list-item--task">
            <a class="list-item__main" href="#tasks">
              <span class="list-item__title">${h.escapeHtml(h.displayText(task.title))}</span>
              <span class="list-item__meta">${h.escapeHtml(h.label("users", task.assignedTo))} · ${h.escapeHtml(h.displayText(task.status))} · ${h.escapeHtml(task.dueDate || "kein Datum")}</span>
            </a>
            <button class="task-delete-x" type="button" title="Aufgabe löschen" aria-label="Aufgabe löschen" data-action="delete" data-module="tasks" data-id="${h.escapeHtml(task.id)}">&times;</button>
          </div>
        `).join("") : `<div class="empty">Keine offenen Aufgaben fÃ¼r ${h.escapeHtml(userName(data))}.</div>`}
      </div>
    `;
  }

  function renderSales(data, h) {
    return `
      <div class="dashboard-metrics">
        ${metric("Kunden", count("customers", data), "#customers", h)}
        ${metric("RFQs", count("rfqs", data), "#rfqs", h)}
        ${metric("Angebote", count("quotes", data), "#quotes", h)}
        ${metric("Aufträge", count("orders", data), "#orders", h)}
      </div>
    `;
  }

  function renderCapacity(data, h) {
    const machines = data.machines || [];
    const blocked = count("machineCalendarEntries", data, (item) => item.status === "blockiert");
    return `
      <div class="dashboard-metrics">
        ${metric("Maschinen", machines.length, "#machines", h)}
        ${metric("Kalender", count("machineCalendarEntries", data), "#machine-calendar", h)}
        ${metric("Blockiert", blocked, "#machine-calendar", h, blocked ? "danger" : "")}
        ${metric("Partner", count("partners", data), "#partners", h)}
      </div>
    `;
  }

  function renderProduction(data, h) {
    return `
      <div class="dashboard-metrics">
        ${metric("Arbeitspläne", count("workPlans", data), "#work-plans", h)}
        ${metric("Arbeitsgänge", count("workOperations", data), "#work-operations", h)}
        ${metric("Fertigungsaufträge", count("productionOrders", data), "#production-orders", h)}
        ${metric("Rückmeldungen", count("operationFeedback", data), "#operation-feedback", h)}
      </div>
    `;
  }

  function renderQuality(data, h) {
    return `
      <div class="dashboard-metrics">
        ${metric("Prüfpläne", count("inspectionPlans", data), "#inspection-plans", h)}
        ${metric("Messprotokolle", count("inspectionReports", data), "#inspection-reports", h)}
        ${metric("Reklamationen", count("complaints", data, (item) => item.status !== "abgeschlossen"), "#complaints", h)}
        ${metric("Erstteile", count("firstArticleApprovals", data), "#first-article", h)}
      </div>
    `;
  }

  function renderMap(data, h) {
    const points = data.mapPoints || [];
    return `
      <div class="map-mini">
        <div>
          <strong>${h.escapeHtml(points.length)}</strong>
          <span>Kartenpunkte vorbereitet</span>
        </div>
        <a class="button button--quiet" href="#maps">Karte öffnen</a>
      </div>
    `;
  }

  function renderAudit(data, h) {
    const rows = (data.auditLogs || []).slice(0, 5);
    return `
      <div class="list">
        ${rows.length ? rows.map((row) => `
          <a class="list-item list-item--link" href="#audit-log">
            <span class="list-item__title">${h.escapeHtml(row.summary || row.action || "Änderung")}</span>
            <span class="list-item__meta">${h.escapeHtml(row.user || "-")} · ${h.escapeHtml(row.collection || "-")} · ${h.escapeHtml(row.timestamp ? new Date(row.timestamp).toLocaleString("de-DE") : "-")}</span>
          </a>
        `).join("") : `<div class="empty">Noch keine Änderungshistorie.</div>`}
      </div>
    `;
  }

  function renderQuickLinks(data, h) {
    const links = [
      ["#customers", "Kunden"],
      ["#tasks", "Aufgaben"],
      ["#employees", "Personal"],
      ["#purchase-orders", "Bestellungen"],
      ["#inspection-reports", "Messprotokolle"],
      ["#finance-postings", "Finanzen"],
      ["#settings", "Einstellungen"]
    ];
    return `
      <div class="quick-link-grid">
        ${links.map(([href, label]) => `<a href="${h.escapeHtml(href)}">${h.escapeHtml(label)}</a>`).join("")}
      </div>
    `;
  }

  function saveLayout(data, summary) {
    window.OSM.state.save(data, { summary: summary || "Dashboard angepasst" });
    window.OSM.render();
  }

  function changeWidget(data, widgetId, action) {
    const layout = normalizeLayout(data);
    const index = layout.findIndex((item) => item.id === widgetId);
    if (index < 0) return;
    if (action === "hide") layout[index].visible = false;
    if (action === "show") layout[index].visible = true;
    if (action === "up" && index > 0) {
      const item = layout.splice(index, 1)[0];
      layout.splice(index - 1, 0, item);
    }
    if (action === "down" && index < layout.length - 1) {
      const item = layout.splice(index, 1)[0];
      layout.splice(index + 1, 0, item);
    }
    saveLayout(data);
  }

  function resetLayout(data) {
    const currentUserId = userId(data);
    data.meta.dashboardLayouts[currentUserId] = (defaultLayouts[currentUserId] || defaultLayouts.usr_abdelaziz)
      .map((id) => ({ id, visible: true }));
    saveLayout(data, "Dashboard-Layout zurückgesetzt");
  }

  function bindDashboardActions() {
    if (window.OSM_DASHBOARD_V2_BOUND) return;
    window.OSM_DASHBOARD_V2_BOUND = true;

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='widget-hide'], [data-action='widget-show'], [data-action='widget-up'], [data-action='widget-down'], [data-action='dashboard-reset'], [data-action='dashboard-save']");
      if (!button || !window.OSM || !window.OSM.data) return;
      const action = button.dataset.action;
      if (action === "dashboard-reset") resetLayout(window.OSM.data);
      if (action === "dashboard-save") window.OSM.state.saveCheckpoint(window.OSM.data, "Startseite gespeichert").then(() => window.OSM.render());
      if (action === "widget-hide") changeWidget(window.OSM.data, button.dataset.widget, "hide");
      if (action === "widget-show") changeWidget(window.OSM.data, button.dataset.widget, "show");
      if (action === "widget-up") changeWidget(window.OSM.data, button.dataset.widget, "up");
      if (action === "widget-down") changeWidget(window.OSM.data, button.dataset.widget, "down");
    });
  }

  bindDashboardActions();

  window.OSM.registerModule({
    id: "dashboard",
    group: "Start",
    icon: "S",
    title: "Start",
    description: "Persönliches Dashboard des aktuell ausgewählten Benutzers.",
    render(data, h) {
      const layout = normalizeLayout(data);
      const widgets = widgetDefinitions();
      const visible = layout
        .filter((item) => item.visible)
        .map((item) => widgets.find((widget) => widget.id === item.id))
        .filter(Boolean);
      const hidden = layout
        .filter((item) => !item.visible)
        .map((item) => widgets.find((widget) => widget.id === item.id))
        .filter(Boolean);
      const user = window.OSM.state.currentUserRecord(data);
      const permissions = window.OSM.state.permissionsForCurrentUser(data);

      return `
        <section class="user-dashboard">
          <div class="dashboard-hero">
            <div>
              <span class="kicker">Persönliche Startseite</span>
              <h1>${h.escapeHtml(user.name)} Dashboard</h1>
              <p>Eigene Oberfläche für ${h.escapeHtml(user.name)}. Rechte bleiben vollständig: lesen, schreiben, anlegen, ändern, löschen und Aufgaben zuweisen.</p>
            </div>
            <div class="permission-card">
              <strong>${h.escapeHtml(user.roleName || "Super Admin")}</strong>
              <span>Alle Module sichtbar und bearbeitbar</span>
              <code>read/write/create/update/delete: ${permissions.delete ? "true" : "false"}</code>
            </div>
          </div>

          <div class="dashboard-toolbar">
            <button class="button" type="button" data-action="dashboard-save">Startseite speichern</button>
            <button class="button button--quiet" type="button" data-action="dashboard-reset">Layout zurücksetzen</button>
            <a class="button button--quiet" href="#roles">Rollen ansehen</a>
          </div>

          <div class="dashboard-grid">
            ${visible.map((widget, index) => widgetShell(widget, index, visible.length, widget.render(data, h), h)).join("")}
          </div>

          <section class="panel panel--pad widget-library">
            <div class="section-head">
              <div>
                <span class="kicker">Widgets</span>
                <h2>Ausgeblendete Widgets</h2>
              </div>
            </div>
            ${hidden.length ? `
              <div class="quick-link-grid">
                ${hidden.map((widget) => `<button type="button" data-action="widget-show" data-widget="${h.escapeHtml(widget.id)}">${h.escapeHtml(widget.title)} einblenden</button>`).join("")}
              </div>
            ` : `<p class="muted">Alle Widgets sind eingeblendet.</p>`}
          </section>
        </section>
      `;
    }
  });
})();
