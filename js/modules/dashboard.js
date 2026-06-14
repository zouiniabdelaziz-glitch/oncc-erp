(function () {
  window.OSM.registerModule({
    id: "dashboard",
    group: "Start",
    icon: "D",
    title: "Dashboard",
    description: "Ueberblick fuer Leitung, Vertrieb und Produktion.",
    render(data, h) {
      const openTasks = data.tasks.filter((task) => task.status !== "erledigt");
      const activeProjects = data.projects.filter((project) => project.status !== "abgeschlossen");
      const openRfqs = data.rfqs.filter((rfq) => !["abgelehnt", "gewonnen"].includes(rfq.status));
      const openOrders = data.orders.filter((order) => order.status !== "geliefert");
      const dueTasks = [...openTasks]
        .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
        .slice(0, 5);
      const rfqDecisions = data.rfqs.slice(0, 5);

      return `
        <div class="topbar">
          <div>
            <h1 class="topbar__title">Dashboard</h1>
            <p class="topbar__text">Management, RFQ, Kapazitaet und Lieferstatus auf einen Blick.</p>
          </div>
        </div>

        <section class="grid grid--stats">
          <div class="stat"><div class="stat__label">Offene Aufgaben</div><div class="stat__value">${openTasks.length}</div></div>
          <div class="stat"><div class="stat__label">Aktive Projekte</div><div class="stat__value">${activeProjects.length}</div></div>
          <div class="stat"><div class="stat__label">Offene RFQs</div><div class="stat__value">${openRfqs.length}</div></div>
          <div class="stat"><div class="stat__label">Offene Auftraege</div><div class="stat__value">${openOrders.length}</div></div>
        </section>

        <section class="grid grid--two">
          <div class="panel panel--pad">
            <h2>Naechste Aufgaben</h2>
            <div class="list">
              ${dueTasks.length ? dueTasks.map((task) => `
                <div class="list-item">
                  <div class="list-item__title">${h.escapeHtml(task.title)}</div>
                  <div class="list-item__meta">${h.escapeHtml(task.dueDate || "-")} &middot; ${h.badge(task.priority, h.toneForStatus(task.priority))} &middot; ${h.escapeHtml(task.owner || "-")}</div>
                </div>
              `).join("") : `<div class="empty">Keine offenen Aufgaben.</div>`}
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>RFQ-Entscheidungen</h2>
            <div class="list">
              ${rfqDecisions.length ? rfqDecisions.map((rfq) => {
                const decision = h.decision(rfq);
                return `
                  <div class="list-item">
                    <div class="list-item__title">${h.escapeHtml(rfq.partName)}</div>
                    <div class="list-item__meta">
                      ${h.escapeHtml(h.label("customers", rfq.customerId))} &middot;
                      ${h.badge(decision.decision, h.toneForStatus(decision.decision))} &middot;
                      Risiko ${h.badge(decision.risk, h.toneForStatus(decision.risk))}
                    </div>
                  </div>
                `;
              }).join("") : `<div class="empty">Keine RFQs vorhanden.</div>`}
            </div>
          </div>
        </section>
      `;
    }
  });
})();
