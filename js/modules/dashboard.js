(function () {
  const primaryAreaIds = ["sales", "pdm", "production", "procurement"];
  const secondaryAreaIds = ["inventory", "quality", "logistics", "finance", "management", "people", "system", "masterdata"];

  function count(collection, data, filter) {
    const rows = data[collection] || [];
    return filter ? rows.filter(filter).length : rows.length;
  }

  function areaById(id) {
    return (window.OSM_AREAS || []).find((area) => area.id === id);
  }

  function areaMetricLine(area, data, h) {
    return window.OSM_AREA_TOOLS.areaMetrics(area, data)
      .slice(0, 2)
      .map((metric) => `<span>${h.escapeHtml(h.displayText(metric.label))}: <strong>${h.escapeHtml(metric.value)}</strong></span>`)
      .join("");
  }

  function launchTile(area, data, h) {
    return `
      <a class="launch-tile" href="#area-${h.escapeHtml(area.id)}">
        <div class="launch-tile__head">
          <span class="launch-tile__icon">${h.escapeHtml((area.title || "?").slice(0, 1).toUpperCase())}</span>
          <strong>${h.escapeHtml(h.displayText(area.title))}</strong>
        </div>
        <p>${h.escapeHtml(h.displayText(area.description))}</p>
        <div class="launch-tile__meta">${areaMetricLine(area, data, h)}</div>
      </a>
    `;
  }

  function compactArea(area, data, h) {
    const firstMetric = window.OSM_AREA_TOOLS.areaMetrics(area, data)[0];
    return `
      <a class="compact-area-link" href="#area-${h.escapeHtml(area.id)}">
        <span>${h.escapeHtml(h.displayText(area.title))}</span>
        ${firstMetric ? `<strong>${h.escapeHtml(firstMetric.value)}</strong>` : ""}
      </a>
    `;
  }

  function rfqRows(data, h) {
    const rfqs = (data.rfqs || [])
      .filter((rfq) => !["abgelehnt", "gewonnen"].includes(rfq.status))
      .slice(0, 4);

    if (!rfqs.length) {
      return `<div class="empty-message">Keine offenen RFQs.</div>`;
    }

    return `
      <div class="mini-table">
        ${rfqs.map((rfq) => {
          const decision = h.decision(rfq);
          return `
            <a class="mini-row" href="#rfqs">
              <span>
                <strong>${h.escapeHtml(h.displayText(rfq.partName))}</strong>
                <small>${h.escapeHtml(h.label("customers", rfq.customerId))}</small>
              </span>
              ${h.badge(decision.decision, h.toneForStatus(decision.decision))}
            </a>
          `;
        }).join("")}
      </div>
    `;
  }

  function taskRows(data, h) {
    const tasks = (data.tasks || [])
      .filter((task) => task.status !== "erledigt")
      .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
      .slice(0, 4);

    if (!tasks.length) {
      return `<div class="empty-message">Keine offenen Aufgaben.</div>`;
    }

    return `
      <div class="mini-table">
        ${tasks.map((task) => `
          <a class="mini-row" href="#tasks">
            <span>
              <strong>${h.escapeHtml(h.displayText(task.title))}</strong>
              <small>${h.escapeHtml(h.displayText(task.owner || "-"))} / ${h.escapeHtml(task.dueDate || "-")}</small>
            </span>
            ${h.badge(task.priority, h.toneForStatus(task.priority))}
          </a>
        `).join("")}
      </div>
    `;
  }

  window.OSM.registerModule({
    id: "dashboard",
    group: "Start",
    icon: "H",
    title: "Hauptseite",
    description: "Führungs- und Arbeitsdashboard für OS.MECHPLAST.",
    render(data, h) {
      const primaryAreas = primaryAreaIds.map(areaById).filter(Boolean);
      const secondaryAreas = secondaryAreaIds.map(areaById).filter(Boolean);
      const openRfqs = count("rfqs", data, (item) => !["abgelehnt", "gewonnen"].includes(item.status));
      const openOrders = count("orders", data, (item) => item.status !== "geliefert");
      const materialNeeds = count("purchaseRequests", data, (item) => !["erhalten", "storniert"].includes(item.status));
      const productionOpen = count("productionOrders", data, (item) => !["fertig", "storniert"].includes(item.status));
      const financeLocks = count("financePostings", data, (item) => item.status === "commercialista offen");
      const critical = materialNeeds + financeLocks;

      return `
        <section class="workspace-header">
          <div>
            <div class="breadcrumb breadcrumb--quiet">
              <a href="#dashboard">Home</a>
              <span>/</span>
              <span>ONCC ERP</span>
            </div>
            <div class="workspace-title-row">
              <h1>OS.MECHPLAST ERP Workspace</h1>
              <span class="workspace-state">Pilotbetrieb</span>
            </div>
            <p>Ein ruhiger Einstieg für RFQ, Angebot, PDM, Einkauf, Lager, Fertigung und Versand.</p>
          </div>
          <div class="workspace-header__actions">
            <a class="button button--quiet" href="#module-map">Modul-Landkarte</a>
            <a class="button" href="#rfqs">Neue RFQ</a>
          </div>
        </section>

        <section class="filter-bar">
          <label class="filter-field">
            <span>Kunde</span>
            <div class="filter-control">Alle Kunden</div>
          </label>
          <label class="filter-field">
            <span>Bereich</span>
            <select>
              <option>Alle Arbeitsbereiche</option>
              <option>Vertrieb & CRM</option>
              <option>Produktion / MRP</option>
              <option>Einkauf</option>
            </select>
          </label>
          <label class="filter-field">
            <span>Status</span>
            <select>
              <option>Offen / relevant</option>
              <option>Kritisch</option>
              <option>Heute</option>
            </select>
          </label>
          <label class="filter-field filter-field--wide">
            <span>Suche</span>
            <input type="search" placeholder="Teil, Kunde, RFQ, Auftrag..." />
          </label>
          <button class="button button--blue" type="button">Anzeigen</button>
        </section>

        <section class="sap-dashboard-grid">
          <article class="sap-card">
            <div class="sap-card__head">
              <div>
                <h2>Alerts</h2>
                <p>Entscheidende offene Punkte</p>
              </div>
              <a href="#tasks">Alle</a>
            </div>
            <div class="alert-line ${critical ? "alert-line--warn" : "alert-line--ok"}">
              <strong>${critical}</strong>
              <span>${critical ? "Punkte brauchen Prüfung" : "Keine kritischen Punkte"}</span>
            </div>
            <div class="status-list">
              <div><span>Materialbedarf</span><strong>${materialNeeds}</strong></div>
              <div><span>Finanz-Sperren</span><strong>${financeLocks}</strong></div>
            </div>
          </article>

          <article class="sap-card">
            <div class="sap-card__head">
              <div>
                <h2>Overall Rating</h2>
                <p>Operative Lage</p>
              </div>
              <a href="#capacity">Details</a>
            </div>
            <div class="rating-block">
              <span class="rating-number">${openRfqs + productionOpen}</span>
              <span>von 8 Prüfpunkten aktiv</span>
            </div>
            <div class="status-list">
              <div><span>Offene RFQs</span><strong>${openRfqs}</strong></div>
              <div><span>Fertigung offen</span><strong>${productionOpen}</strong></div>
            </div>
          </article>

          <article class="sap-card sap-card--wide">
            <div class="sap-card__head">
              <div>
                <h2>Nächste Arbeit</h2>
                <p>RFQs und Aufgaben, die zuerst entschieden werden sollten</p>
              </div>
              <div class="segmented">
                <a class="is-active" href="#rfqs">RFQs</a>
                <a href="#tasks">Aufgaben</a>
              </div>
            </div>
            <div class="two-column-list">
              <div>
                <h3>RFQ Pipeline</h3>
                ${rfqRows(data, h)}
              </div>
              <div>
                <h3>Aufgaben</h3>
                ${taskRows(data, h)}
              </div>
            </div>
          </article>
        </section>

        <section class="launch-section">
          <div class="section-head">
            <div>
              <span class="kicker">Arbeitsbereiche</span>
              <h2>Hauptarbeit</h2>
            </div>
            <span class="section-note">${openOrders} offene Aufträge</span>
          </div>
          <div class="launch-grid">
            ${primaryAreas.map((area) => launchTile(area, data, h)).join("")}
          </div>
        </section>

        <section class="launch-section launch-section--compact">
          <div class="section-head">
            <div>
              <span class="kicker">Weitere Bereiche</span>
              <h2>Bei Bedarf öffnen</h2>
            </div>
          </div>
          <div class="compact-area-grid">
            ${secondaryAreas.map((area) => compactArea(area, data, h)).join("")}
          </div>
        </section>
      `;
    }
  });
})();
