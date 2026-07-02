(function () {
  let countryFilter = "alle";
  let statusFilter = "alle";
  let typeFilter = "alle";
  let selectedPointId = "";

  function orderPoints(data) {
    return (data.orders || [])
      .filter((order) => order.status !== "geliefert")
      .map((order) => {
        const customerPoint = (data.mapPoints || []).find((point) => point.linkedCollection === "customers" && point.linkedId === order.customerId);
        if (!customerPoint) return null;
        return Object.assign({}, customerPoint, {
          id: `map_order_${order.id}`,
          type: "order",
          linkedCollection: "orders",
          linkedId: order.id,
          name: order.orderNo || order.partName || "Aktiver Auftrag",
          status: order.status || "offen",
          notes: `Aktiver Auftrag bei ${customerPoint.name}`
        });
      })
      .filter(Boolean);
  }

  function allPoints(data) {
    return (data.mapPoints || []).concat(orderPoints(data));
  }

  function pointTypeLabel(type) {
    if (type === "customer") return "Kunde";
    if (type === "supplier") return "Lieferant";
    if (type === "order") return "Aktiver Auftrag";
    return type || "-";
  }

  function filterPoints(points) {
    return points.filter((point) => {
      const countryOk = countryFilter === "alle" || point.country === countryFilter;
      const statusOk = statusFilter === "alle" || point.status === statusFilter;
      const typeOk = typeFilter === "alle" || point.type === typeFilter;
      return countryOk && statusOk && typeOk;
    });
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  function markerStyle(point) {
    const lng = Number(point.lng || 10);
    const lat = Number(point.lat || 46);
    const x = Math.max(6, Math.min(94, ((lng + 5) / 30) * 100));
    const y = Math.max(8, Math.min(90, 100 - (((lat - 35) / 20) * 100)));
    return `left:${x.toFixed(1)}%; top:${y.toFixed(1)}%;`;
  }

  function detailLink(point) {
    if (point.linkedCollection === "customers") return "#customers";
    if (point.linkedCollection === "suppliers") return "#suppliers";
    if (point.linkedCollection === "orders") return "#orders";
    return "#maps";
  }

  function bindMapActions() {
    if (window.OSM_MAPS_BOUND) return;
    window.OSM_MAPS_BOUND = true;

    document.addEventListener("click", (event) => {
      const marker = event.target.closest("[data-action='select-map-point']");
      if (!marker) return;
      selectedPointId = marker.dataset.point;
      window.OSM.render();
    });

    document.addEventListener("change", (event) => {
      if (event.target.dataset.action === "map-country") {
        countryFilter = event.target.value;
        window.OSM.render();
      }
      if (event.target.dataset.action === "map-status") {
        statusFilter = event.target.value;
        window.OSM.render();
      }
      if (event.target.dataset.action === "map-type") {
        typeFilter = event.target.value;
        window.OSM.render();
      }
    });
  }

  bindMapActions();

  window.OSM.registerModule({
    id: "maps",
    group: "Karte / Berichte",
    icon: "M",
    title: "Karte / Maps",
    description: "Kunden, Lieferanten und aktive Aufträge nach Ort vorbereiten.",
    render(data, h) {
      const points = allPoints(data);
      const filtered = filterPoints(points);
      const selected = filtered.find((point) => point.id === selectedPointId) || filtered[0] || null;
      const countries = unique(points.map((point) => point.country));
      const statuses = unique(points.map((point) => point.status));
      const types = unique(points.map((point) => point.type));

      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Start</a>
              <span>/</span>
              <a href="#maps">Karte / Maps</a>
            </div>
            <h1 class="topbar__title">Karte / Maps</h1>
            <p class="topbar__text">Vorbereitete Kartenlogik für Kunden, Lieferanten und aktive Aufträge. Echte Geodaten können später angebunden werden.</p>
          </div>
        </div>

        <div class="filter-bar filter-bar--compact">
          <label class="filter-field">
            <span>Land</span>
            <select data-action="map-country">
              <option value="alle">Alle Länder</option>
              ${countries.map((country) => `<option value="${h.escapeHtml(country)}" ${countryFilter === country ? "selected" : ""}>${h.escapeHtml(country)}</option>`).join("")}
            </select>
          </label>
          <label class="filter-field">
            <span>Status</span>
            <select data-action="map-status">
              <option value="alle">Alle Status</option>
              ${statuses.map((status) => `<option value="${h.escapeHtml(status)}" ${statusFilter === status ? "selected" : ""}>${h.escapeHtml(h.displayText(status))}</option>`).join("")}
            </select>
          </label>
          <label class="filter-field">
            <span>Typ</span>
            <select data-action="map-type">
              <option value="alle">Alle Typen</option>
              ${types.map((type) => `<option value="${h.escapeHtml(type)}" ${typeFilter === type ? "selected" : ""}>${h.escapeHtml(pointTypeLabel(type))}</option>`).join("")}
            </select>
          </label>
        </div>

        <section class="maps-layout">
          <div class="map-board">
            <div class="map-board__label">Europa / DACH / Norditalien</div>
            ${filtered.map((point) => `
              <button class="map-marker map-marker--${h.escapeHtml(point.type)} ${selected && selected.id === point.id ? "is-selected" : ""}" type="button" style="${h.escapeHtml(markerStyle(point))}" data-action="select-map-point" data-point="${h.escapeHtml(point.id)}" title="${h.escapeHtml(point.name)}">
                <span></span>
              </button>
            `).join("")}
          </div>

          <aside class="map-detail panel panel--pad">
            ${selected ? `
              <span class="kicker">${h.escapeHtml(pointTypeLabel(selected.type))}</span>
              <h2>${h.escapeHtml(selected.name)}</h2>
              <div class="status-list">
                <div><span>Land</span><strong>${h.escapeHtml(selected.country || "-")}</strong></div>
                <div><span>Ort</span><strong>${h.escapeHtml(selected.city || "-")}</strong></div>
                <div><span>Status</span>${h.badge(selected.status, h.toneForStatus(selected.status))}</div>
                <div><span>Koordinate</span><strong>${h.escapeHtml(selected.lat)}, ${h.escapeHtml(selected.lng)}</strong></div>
              </div>
              <p class="muted">${h.escapeHtml(selected.notes || "")}</p>
              <a class="button" href="${h.escapeHtml(detailLink(selected))}">Detail öffnen</a>
            ` : `
              <h2>Keine Treffer</h2>
              <p class="muted">Filter ändern oder später echte Kunden-/Lieferantendaten mit Koordinaten ergänzen.</p>
            `}
          </aside>
        </section>

        <section class="panel panel--pad">
          <div class="section-head">
            <div>
              <span class="kicker">Treffer</span>
              <h2>${h.escapeHtml(filtered.length)} Kartenpunkte</h2>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Typ</th>
                  <th>Land</th>
                  <th>Ort</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map((point) => `
                  <tr>
                    <td>${h.escapeHtml(point.name)}</td>
                    <td>${h.escapeHtml(pointTypeLabel(point.type))}</td>
                    <td>${h.escapeHtml(point.country || "-")}</td>
                    <td>${h.escapeHtml(point.city || "-")}</td>
                    <td>${h.badge(point.status, h.toneForStatus(point.status))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>
      `;
    }
  });
})();
