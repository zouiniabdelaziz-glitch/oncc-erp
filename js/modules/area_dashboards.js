(function () {
  const areas = window.OSM_AREAS || [];
  const tools = window.OSM_AREA_TOOLS || {};

  function modulePills(area, h) {
    return (area.modules || [])
      .map((moduleId) => tools.moduleById(moduleId))
      .filter(Boolean)
      .map((module) => `
        <a class="module-pill" href="#${h.escapeHtml(module.id)}">
          <span class="module-pill__icon">${h.escapeHtml(module.icon || "")}</span>
          <span>${h.escapeHtml(module.title)}</span>
        </a>
      `)
      .join("");
  }

  function relatedAreas(area, h) {
    return (area.related || [])
      .map((areaId) => tools.findArea(areaId))
      .filter(Boolean)
      .map((related) => `
        <a class="related-card" href="#area-${h.escapeHtml(related.id)}">
          <strong>${h.escapeHtml(related.title)}</strong>
          <span>${h.escapeHtml(related.description)}</span>
        </a>
      `)
      .join("");
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
        const metrics = tools.areaMetrics(area, data);
        const important = tools.importantRows(area, data);

        return `
          <div class="topbar">
            <div>
              <div class="breadcrumb">
                <a href="#dashboard">Hauptseite</a>
                <span>/</span>
                <span>${h.escapeHtml(area.title)}</span>
              </div>
              <h1 class="topbar__title">${h.escapeHtml(area.title)}</h1>
              <p class="topbar__text">${h.escapeHtml(area.description)}</p>
            </div>
            <div class="page-actions">
              <a class="button button--quiet" href="#dashboard">Zurueck</a>
            </div>
          </div>

          <section class="grid grid--stats">
            ${metrics.map((metric) => `
              <div class="stat">
                <div class="stat__label">${h.escapeHtml(metric.label)}</div>
                <div class="stat__value">${h.escapeHtml(metric.value)}</div>
              </div>
            `).join("")}
          </section>

          <section class="grid grid--two">
            <div class="panel panel--pad">
              <h2>Untermenues</h2>
              <p class="muted">Alles, was direkt zu diesem Thema gehoert.</p>
              <div class="module-pill-grid">
                ${modulePills(area, h)}
              </div>
            </div>

            <div class="panel panel--pad">
              <h2>Wichtige Eintraege</h2>
              <div class="list">
                ${important.length ? important.map((item) => `
                  <a class="list-item list-item--link" href="#${h.escapeHtml(item.moduleId)}">
                    <div class="list-item__title">${h.escapeHtml(item.title)}</div>
                    <div class="list-item__meta">${h.escapeHtml(item.moduleTitle)}${item.meta ? ` / ${h.escapeHtml(item.meta)}` : ""}</div>
                  </a>
                `).join("") : `<div class="empty">Keine offenen oder kritischen Eintraege in diesem Bereich.</div>`}
              </div>
            </div>
          </section>

          <section class="panel panel--pad area-related">
            <h2>Verbunden mit</h2>
            <div class="related-grid">
              ${relatedAreas(area, h)}
            </div>
          </section>
        `;
      }
    });
  });
})();
