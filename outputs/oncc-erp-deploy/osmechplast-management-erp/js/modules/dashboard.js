(function () {
  const allAppIds = [
    "customers", "contacts", "rfqs", "offer-calculator", "quotes", "orders",
    "tasks", "projects", "parts", "part-revisions", "files", "suppliers",
    "purchase-requests", "stock-items", "capacity", "production-orders",
    "machine-calendar", "deliveries", "inspection-reports", "settings"
  ];

  const defaultPersonalApps = {
    owner: ["customers", "rfqs", "offer-calculator", "tasks", "capacity", "settings"],
    mohammed: ["production-orders", "machine-calendar", "tasks", "capacity", "deliveries", "inspection-reports"]
  };

  const appColors = [
    "blue", "green", "orange", "red", "violet", "cyan", "slate", "lime"
  ];

  const compactLabels = {
    "offer-calculator": "Rechner",
    "part-revisions": "Revisionen",
    "purchase-requests": "Einkaufsbedarf",
    "stock-items": "Bestände",
    "production-orders": "Fertigung",
    "machine-calendar": "Kalender",
    "inspection-reports": "Qualität",
    "module-map": "Module",
    "capacity": "Kapazität"
  };

  function count(collection, data, filter) {
    const rows = data[collection] || [];
    return filter ? rows.filter(filter).length : rows.length;
  }

  function moduleById(id) {
    return (window.OSM.modules || []).find((module) => module.id === id);
  }

  function moduleInitial(module) {
    return (module.icon || module.title || "?").slice(0, 1).toUpperCase();
  }

  function compactTitle(module, h) {
    return compactLabels[module.id] || h.displayText(module.title);
  }

  function ensurePersonal(data) {
    data.meta = data.meta || {};
    data.meta.personalWorkspaces = data.meta.personalWorkspaces || {};
    Object.keys(defaultPersonalApps).forEach((key) => {
      if (!Array.isArray(data.meta.personalWorkspaces[key])) {
        data.meta.personalWorkspaces[key] = defaultPersonalApps[key].slice();
      }
    });
    return data.meta.personalWorkspaces;
  }

  function appTile(module, h, options) {
    const color = appColors[Math.abs(module.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % appColors.length];
    const remove = options && options.user ? `
      <button class="app-tile__remove" type="button" data-action="personal-remove" data-user="${h.escapeHtml(options.user)}" data-module="${h.escapeHtml(module.id)}" aria-label="Entfernen">x</button>
    ` : "";
    return `
      <div class="app-tile-wrap">
        <a class="app-tile" href="#${h.escapeHtml(module.id)}">
          <span class="app-icon app-icon--${color}">${h.escapeHtml(moduleInitial(module))}</span>
          <span>${h.escapeHtml(compactTitle(module, h))}</span>
        </a>
        ${remove}
      </div>
    `;
  }

  function personalPanel(key, title, subtitle, data, h) {
    const personal = ensurePersonal(data);
    const modules = (personal[key] || [])
      .map(moduleById)
      .filter(Boolean);

    return `
      <section class="personal-panel">
        <div class="personal-panel__head">
          <div>
            <span class="kicker">Persönlich</span>
            <h2>${h.escapeHtml(title)}</h2>
            <p>${h.escapeHtml(subtitle)}</p>
          </div>
        </div>
        <div class="personal-app-grid">
          ${modules.length ? modules.map((module) => appTile(module, h, { user: key })).join("") : `
            <div class="personal-empty">Noch keine Apps. Unten aus der App-Bibliothek hinzufügen.</div>
          `}
        </div>
      </section>
    `;
  }

  function libraryTile(module, h) {
    const color = appColors[Math.abs(module.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % appColors.length];
    return `
      <article class="library-app">
        <a class="library-app__main" href="#${h.escapeHtml(module.id)}">
          <span class="app-icon app-icon--${color}">${h.escapeHtml(moduleInitial(module))}</span>
          <span>
            <strong>${h.escapeHtml(h.displayText(module.title))}</strong>
            <small>${h.escapeHtml(h.displayText(module.description || "Modul öffnen"))}</small>
          </span>
        </a>
        <div class="library-app__actions">
          <button type="button" data-action="personal-add" data-user="owner" data-module="${h.escapeHtml(module.id)}">Zu mir</button>
          <button type="button" data-action="personal-add" data-user="mohammed" data-module="${h.escapeHtml(module.id)}">Zu Mohammed</button>
        </div>
      </article>
    `;
  }

  function bindPersonalActions() {
    if (window.OSM_DASHBOARD_PERSONAL_BOUND) return;
    window.OSM_DASHBOARD_PERSONAL_BOUND = true;

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='personal-add'], [data-action='personal-remove']");
      if (!button || !window.OSM || !window.OSM.data) return;
      const user = button.dataset.user;
      const moduleId = button.dataset.module;
      const personal = ensurePersonal(window.OSM.data);
      personal[user] = personal[user] || [];

      if (button.dataset.action === "personal-add" && !personal[user].includes(moduleId)) {
        personal[user].push(moduleId);
      }
      if (button.dataset.action === "personal-remove") {
        personal[user] = personal[user].filter((id) => id !== moduleId);
      }

      window.OSM.state.save(window.OSM.data);
      window.OSM.render();
    });
  }

  bindPersonalActions();

  window.OSM.registerModule({
    id: "dashboard",
    group: "Start",
    icon: "H",
    title: "Hauptseite",
    description: "App-Workspace für OS.MECHPLAST.",
    render(data, h) {
      ensurePersonal(data);
      const apps = allAppIds.map(moduleById).filter(Boolean);
      const openRfqs = count("rfqs", data, (item) => !["abgelehnt", "gewonnen"].includes(item.status));
      const openOrders = count("orders", data, (item) => item.status !== "geliefert");
      const openTasks = count("tasks", data, (item) => item.status !== "erledigt");
      const materialNeeds = count("purchaseRequests", data, (item) => !["erhalten", "storniert"].includes(item.status));

      return `
        <section class="app-home">
          <div class="app-home__hero">
            <div>
              <span class="kicker">ONCC ERP</span>
              <h1>Workspace</h1>
              <p>Öffne nur die App, die du gerade brauchst. Details, Tabellen und Entscheidungen liegen in den einzelnen Modulen.</p>
            </div>
            <div class="home-status-strip">
              <a href="#rfqs"><strong>${openRfqs}</strong><span>RFQs</span></a>
              <a href="#orders"><strong>${openOrders}</strong><span>Aufträge</span></a>
              <a href="#tasks"><strong>${openTasks}</strong><span>Aufgaben</span></a>
              <a href="#purchase-requests"><strong>${materialNeeds}</strong><span>Materialbedarf</span></a>
            </div>
          </div>

          <div class="personal-workspaces">
            ${personalPanel("owner", "Mein Bereich", "Alles, was für dich schnell erreichbar sein soll.", data, h)}
            ${personalPanel("mohammed", "Mohammed", "Apps und Funktionen für Mohammeds tägliche Arbeit.", data, h)}
          </div>

          <section class="app-library">
            <div class="section-head">
              <div>
                <span class="kicker">Apps</span>
                <h2>Alle wichtigen Module</h2>
              </div>
              <span class="section-note">Apps öffnen oder zu einem persönlichen Bereich hinzufügen</span>
            </div>
            <div class="library-grid">
              ${apps.map((module) => libraryTile(module, h)).join("")}
            </div>
          </section>
        </section>
      `;
    }
  });
})();
