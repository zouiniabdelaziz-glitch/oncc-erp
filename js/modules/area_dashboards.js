(function () {
  const areas = window.OSM_AREAS || [];
  const tools = window.OSM_AREA_TOOLS || {};

  function moduleRows(area, h) {
    return (area.modules || [])
      .map((moduleId) => tools.moduleById(moduleId))
      .filter(Boolean)
      .map((module) => `
        <a class="area-module-row" href="#${h.escapeHtml(module.id)}">
          <span class="area-module-row__icon">${h.escapeHtml(module.icon || module.title.slice(0, 1))}</span>
          <span>
            <strong>${h.escapeHtml(h.displayText(module.title))}</strong>
            <small>${h.escapeHtml(h.displayText(module.description || "Modul öffnen"))}</small>
          </span>
        </a>
      `)
      .join("");
  }

  function relatedAreas(area, h) {
    return (area.related || [])
      .map((areaId) => tools.findArea(areaId))
      .filter(Boolean)
      .map((related) => `
        <a class="compact-area-link" href="#area-${h.escapeHtml(related.id)}">
          <span>${h.escapeHtml(h.displayText(related.title))}</span>
          <small>${h.escapeHtml(h.displayText(related.description))}</small>
        </a>
      `)
      .join("");
  }

  function metricCards(area, data, h) {
    return tools.areaMetrics(area, data).map((metric) => `
      <div class="area-metric">
        <span>${h.escapeHtml(h.displayText(metric.label))}</span>
        <strong>${h.escapeHtml(metric.value)}</strong>
      </div>
    `).join("");
  }

  areas.forEach((area) => {
    window.OSM.registerModule({
      id: `area-${area.id}`,
      group: "Bereiche",
      icon: "",
      title: `${area.title} Dashboard`,
      description: area.description,
      hideInNav: true,
      render(data, h) {
        const important = tools.importantRows(area, data);

        return `
          <section class="workspace-header workspace-header--area">
            <div>
              <div class="breadcrumb breadcrumb--quiet">
                <a href="#dashboard">Home</a>
                <span>/</span>
                <span>${h.escapeHtml(h.displayText(area.title))}</span>
              </div>
              <div class="workspace-title-row">
                <h1>${h.escapeHtml(h.displayText(area.title))}</h1>
                <span class="workspace-state">Bereich</span>
              </div>
              <p>${h.escapeHtml(h.displayText(area.description))}</p>
            </div>
            <div class="workspace-header__actions">
              <a class="button button--quiet" href="#dashboard">Zurück</a>
            </div>
          </section>

          <section class="filter-bar filter-bar--compact">
            <label class="filter-field">
              <span>Status</span>
              <select>
                <option>Offen / relevant</option>
                <option>Alle Einträge</option>
                <option>Kritisch</option>
              </select>
            </label>
            <label class="filter-field">
              <span>Zeitraum</span>
              <select>
                <option>Heute und nächste 30 Tage</option>
                <option>Diese Woche</option>
                <option>Dieser Monat</option>
              </select>
            </label>
            <label class="filter-field filter-field--wide">
              <span>Suche im Bereich</span>
              <input type="search" placeholder="Teil, Vorgang, Kunde, Lieferant..." />
            </label>
            <button class="button button--blue" type="button">Anzeigen</button>
          </section>

          <section class="area-summary-grid">
            ${metricCards(area, data, h)}
          </section>

          <section class="area-layout">
            <article class="sap-card sap-card--large">
              <div class="sap-card__head">
                <div>
                  <h2>Arbeitsmodule</h2>
                  <p>Nur die Unterpunkte dieses Bereichs</p>
                </div>
              </div>
              <div class="area-module-list">
                ${moduleRows(area, h)}
              </div>
            </article>

            <aside class="sap-card">
              <div class="sap-card__head">
                <div>
                  <h2>Wichtige Einträge</h2>
                  <p>Offen, neu oder kritisch</p>
                </div>
              </div>
              <div class="mini-table">
                ${important.length ? important.map((item) => `
                  <a class="mini-row" href="#${h.escapeHtml(item.moduleId)}">
                    <span>
                      <strong>${h.escapeHtml(h.displayText(item.title))}</strong>
                      <small>${h.escapeHtml(h.displayText(item.moduleTitle))}${item.meta ? ` / ${h.escapeHtml(h.displayText(item.meta))}` : ""}</small>
                    </span>
                  </a>
                `).join("") : `<div class="empty-message">Keine offenen oder kritischen Einträge.</div>`}
              </div>
            </aside>
          </section>

          <section class="launch-section launch-section--compact">
            <div class="section-head">
              <div>
                <span class="kicker">Verbindungen</span>
                <h2>Mit diesem Bereich verbunden</h2>
              </div>
            </div>
            <div class="compact-area-grid">
              ${relatedAreas(area, h)}
            </div>
          </section>
        `;
      }
    });
  });
})();
