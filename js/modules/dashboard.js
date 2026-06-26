(function () {
  function areaCard(area, data, h) {
    const metrics = window.OSM_AREA_TOOLS.areaMetrics(area, data).slice(0, 4);
    const modules = (area.modules || [])
      .map((moduleId) => window.OSM_AREA_TOOLS.moduleById(moduleId))
      .filter(Boolean)
      .slice(0, 6);

    return `
      <a class="area-card" href="#area-${h.escapeHtml(area.id)}">
        <div class="area-card__top">
          <h2>${h.escapeHtml(area.title)}</h2>
          <span>Oeffnen</span>
        </div>
        <p>${h.escapeHtml(area.description)}</p>
        <div class="area-card__metrics">
          ${metrics.map((metric) => `
            <div>
              <strong>${h.escapeHtml(metric.value)}</strong>
              <span>${h.escapeHtml(metric.label)}</span>
            </div>
          `).join("")}
        </div>
        <div class="area-card__modules">
          ${modules.map((module) => `<span>${h.escapeHtml(module.title)}</span>`).join("")}
        </div>
      </a>
    `;
  }

  window.OSM.registerModule({
    id: "dashboard",
    group: "Start",
    icon: "H",
    title: "Hauptseite",
    description: "Alles Wichtige als Einstieg: Bereiche, Kennzahlen, Aufgaben und Entscheidungen.",
    render(data, h) {
      const areas = window.OSM_AREAS || [];
      const openTasks = (data.tasks || []).filter((task) => task.status !== "erledigt");
      const activeProjects = (data.projects || []).filter((project) => project.status !== "abgeschlossen");
      const openRfqs = (data.rfqs || []).filter((rfq) => !["abgelehnt", "gewonnen"].includes(rfq.status));
      const openOrders = (data.orders || []).filter((order) => order.status !== "geliefert");
      const openPurchaseRequests = (data.purchaseRequests || []).filter((item) => !["erhalten", "storniert"].includes(item.status));
      const openReservations = (data.reservations || []).filter((item) => item.status !== "erledigt");
      const pendingRevisions = (data.partRevisions || []).filter((item) => item.status !== "freigegeben");
      const financeLocks = (data.financePostings || []).filter((item) => item.status === "commercialista offen");
      const dueTasks = [...openTasks]
        .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
        .slice(0, 6);
      const rfqDecisions = (data.rfqs || []).slice(0, 6);

      return `
        <section class="home-hero">
          <div>
            <div class="brand__eyebrow">OS.MECHPLAST SRLS</div>
            <h1>Hauptseite / Dashboard</h1>
            <p>Von hier gehst du in jedes grosse Thema. Jeder Bereich hat sein eigenes Dashboard, seine Untermenues und Verbindungen zu den naechsten Schritten.</p>
          </div>
          <div class="home-hero__actions">
            <a class="button" href="#area-sales">RFQ / Vertrieb</a>
            <a class="button button--quiet" href="#area-procurement">Einkauf</a>
            <a class="button button--quiet" href="#area-production">Produktion</a>
          </div>
        </section>

        <section class="grid grid--stats">
          <div class="stat"><div class="stat__label">Offene Aufgaben</div><div class="stat__value">${openTasks.length}</div></div>
          <div class="stat"><div class="stat__label">Aktive Projekte</div><div class="stat__value">${activeProjects.length}</div></div>
          <div class="stat"><div class="stat__label">Offene RFQs</div><div class="stat__value">${openRfqs.length}</div></div>
          <div class="stat"><div class="stat__label">Offene Auftraege</div><div class="stat__value">${openOrders.length}</div></div>
          <div class="stat"><div class="stat__label">Materialbedarf</div><div class="stat__value">${openPurchaseRequests.length}</div></div>
          <div class="stat"><div class="stat__label">Reservierungen</div><div class="stat__value">${openReservations.length}</div></div>
          <div class="stat"><div class="stat__label">PDM zu pruefen</div><div class="stat__value">${pendingRevisions.length}</div></div>
          <div class="stat"><div class="stat__label">Finanz-Sperren</div><div class="stat__value">${financeLocks.length}</div></div>
        </section>

        <section class="area-overview">
          ${areas.map((area) => areaCard(area, data, h)).join("")}
        </section>

        <section class="grid grid--two">
          <div class="panel panel--pad">
            <h2>Naechste Aufgaben</h2>
            <div class="list">
              ${dueTasks.length ? dueTasks.map((task) => `
                <a class="list-item list-item--link" href="#tasks">
                  <div class="list-item__title">${h.escapeHtml(task.title)}</div>
                  <div class="list-item__meta">${h.escapeHtml(task.dueDate || "-")} / ${h.badge(task.priority, h.toneForStatus(task.priority))} / ${h.escapeHtml(task.owner || "-")}</div>
                </a>
              `).join("") : `<div class="empty">Keine offenen Aufgaben.</div>`}
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>RFQ-Entscheidungen</h2>
            <div class="list">
              ${rfqDecisions.length ? rfqDecisions.map((rfq) => {
                const decision = h.decision(rfq);
                return `
                  <a class="list-item list-item--link" href="#rfqs">
                    <div class="list-item__title">${h.escapeHtml(rfq.partName)}</div>
                    <div class="list-item__meta">
                      ${h.escapeHtml(h.label("customers", rfq.customerId))} /
                      ${h.badge(decision.decision, h.toneForStatus(decision.decision))} /
                      Risiko ${h.badge(decision.risk, h.toneForStatus(decision.risk))}
                    </div>
                  </a>
                `;
              }).join("") : `<div class="empty">Keine RFQs vorhanden.</div>`}
            </div>
          </div>
        </section>
      `;
    }
  });
})();
