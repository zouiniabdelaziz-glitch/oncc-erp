(function () {
  const baseModuleIds = [
    "customers", "contacts", "rfqs", "offer-calculator", "quotes", "orders",
    "tasks", "projects", "parts", "part-revisions", "files", "suppliers",
    "purchase-requests", "stock-items", "capacity", "production-orders",
    "machine-calendar", "deliveries", "inspection-reports", "settings"
  ];

  const defaultPersonalShortcuts = {
    owner: [
      "app:customers", "action:customer-import", "app:rfqs", "app:offer-calculator",
      "app:tasks", "area:sales", "area:management", "action:save-status"
    ],
    mohammed: [
      "app:production-orders", "app:machine-calendar", "app:tasks", "app:capacity",
      "app:deliveries", "app:inspection-reports", "area:production"
    ]
  };

  const specialShortcuts = [
    {
      id: "action:customer-import",
      title: "Kundenimport",
      description: "Excel, CSV oder TSV in Kunden übernehmen.",
      icon: "KI",
      color: "green",
      kind: "Funktion",
      action: "customer-import"
    },
    {
      id: "action:new-task",
      title: "Neue Aufgabe",
      description: "Schnell eine Aufgabe für dich oder Mohammed anlegen.",
      icon: "+A",
      color: "blue",
      kind: "Funktion",
      action: "add:tasks"
    },
    {
      id: "action:new-project",
      title: "Neues Projekt",
      description: "Ein internes oder Kundenprojekt starten.",
      icon: "+P",
      color: "violet",
      kind: "Funktion",
      action: "add:projects"
    },
    {
      id: "action:capacity-check",
      title: "Kapazitätscheck",
      description: "Maschine, Schichtbedarf und Risiko bewerten.",
      icon: "KC",
      color: "orange",
      kind: "Funktion",
      href: "#offer-calculator"
    },
    {
      id: "action:save-status",
      title: "Speichern & Historie",
      description: "Speicherstand, Cloud-Fallback und Historie prüfen.",
      icon: "SH",
      color: "slate",
      kind: "System",
      href: "#settings"
    }
  ];

  const appColors = ["blue", "green", "orange", "red", "violet", "cyan", "slate", "lime"];
  let workspaceFilter = "";

  function count(collection, data, filter) {
    const rows = data[collection] || [];
    return filter ? rows.filter(filter).length : rows.length;
  }

  function moduleById(id) {
    return (window.OSM.modules || []).find((module) => module.id === id);
  }

  function areaById(id) {
    return (window.OSM_AREAS || []).find((area) => area.id === id);
  }

  function hashColor(id) {
    return appColors[Math.abs(String(id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % appColors.length];
  }

  function initials(text) {
    const words = String(text || "?").replace("&", " ").split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  function compactTitle(module, h) {
    const labels = {
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
    return labels[module.id] || h.displayText(module.title);
  }

  function normalizeShortcutId(id) {
    if (!id) return "";
    if (id.startsWith("app:") || id.startsWith("area:") || id.startsWith("action:")) return id;
    if (moduleById(id)) return `app:${id}`;
    if (areaById(id)) return `area:${id}`;
    return id;
  }

  function ensurePersonal(data) {
    data.meta = data.meta || {};
    data.meta.personalWorkspaces = data.meta.personalWorkspaces || {};
    const shouldMergeLaunchpadDefaults = !data.meta.launchpadV2PersonalDefaultsApplied;
    Object.keys(defaultPersonalShortcuts).forEach((key) => {
      const current = data.meta.personalWorkspaces[key];
      if (!Array.isArray(current)) {
        data.meta.personalWorkspaces[key] = defaultPersonalShortcuts[key].slice();
      } else {
        data.meta.personalWorkspaces[key] = current.map(normalizeShortcutId).filter(Boolean);
        if (shouldMergeLaunchpadDefaults) {
          defaultPersonalShortcuts[key].forEach((shortcutId) => {
            if (!data.meta.personalWorkspaces[key].includes(shortcutId)) {
              data.meta.personalWorkspaces[key].push(shortcutId);
            }
          });
        }
      }
    });
    data.meta.launchpadV2PersonalDefaultsApplied = true;
    return data.meta.personalWorkspaces;
  }

  function shortcutById(id, h) {
    const normalizedId = normalizeShortcutId(id);
    const special = specialShortcuts.find((item) => item.id === normalizedId);
    if (special) return special;

    if (normalizedId.startsWith("app:")) {
      const module = moduleById(normalizedId.slice(4));
      if (!module) return null;
      return {
        id: normalizedId,
        title: compactTitle(module, h),
        description: h.displayText(module.description || "Modul öffnen"),
        icon: module.icon || initials(module.title),
        color: hashColor(module.id),
        kind: module.group || "App",
        href: `#${module.id}`
      };
    }

    if (normalizedId.startsWith("area:")) {
      const area = areaById(normalizedId.slice(5));
      if (!area) return null;
      return {
        id: normalizedId,
        title: area.title,
        description: h.displayText(area.description || "Bereich öffnen"),
        icon: initials(area.title),
        color: hashColor(area.id),
        kind: "Bereich",
        href: `#area-${area.id}`
      };
    }

    return null;
  }

  function allShortcuts(h) {
    const moduleIds = Array.from(new Set(baseModuleIds.concat(
      (window.OSM.modules || []).map((module) => module.id)
    ))).filter((id) => id && id !== "dashboard" && !id.startsWith("area-"));
    const appShortcuts = moduleIds
      .map((id) => shortcutById(`app:${id}`, h))
      .filter(Boolean);
    const areaShortcuts = (window.OSM_AREAS || [])
      .map((area) => shortcutById(`area:${area.id}`, h))
      .filter(Boolean);
    return specialShortcuts.concat(areaShortcuts, appShortcuts);
  }

  function shortcutMatches(shortcut) {
    if (!workspaceFilter) return true;
    const haystack = `${shortcut.title} ${shortcut.description} ${shortcut.kind}`.toLowerCase();
    return haystack.includes(workspaceFilter.toLowerCase());
  }

  function shortcutInner(shortcut, h) {
    return `
      <span class="app-icon app-icon--${h.escapeHtml(shortcut.color || "blue")}">${h.escapeHtml(shortcut.icon || initials(shortcut.title))}</span>
      <span class="shortcut-tile__text">
        <strong>${h.escapeHtml(h.displayText(shortcut.title))}</strong>
        <small>${h.escapeHtml(h.displayText(shortcut.kind || ""))}</small>
      </span>
    `;
  }

  function shortcutTile(shortcut, h, options = {}) {
    const remove = options.user ? `
      <button class="shortcut-tile__remove" type="button" data-action="personal-remove" data-user="${h.escapeHtml(options.user)}" data-shortcut="${h.escapeHtml(shortcut.id)}" aria-label="Entfernen">×</button>
    ` : "";
    const attrs = shortcut.action
      ? `button type="button" data-action="workspace-shortcut" data-shortcut="${h.escapeHtml(shortcut.id)}"`
      : `a href="${h.escapeHtml(shortcut.href || "#dashboard")}"`;
    const closing = shortcut.action ? "button" : "a";

    return `
      <div class="shortcut-tile-wrap">
        <${attrs} class="shortcut-tile">
          ${shortcutInner(shortcut, h)}
        </${closing}>
        ${remove}
      </div>
    `;
  }

  function personalPanel(key, title, subtitle, data, h) {
    const personal = ensurePersonal(data);
    const shortcuts = (personal[key] || [])
      .map((id) => shortcutById(id, h))
      .filter(Boolean);

    return `
      <section class="workspace-person">
        <div class="workspace-person__head">
          <div>
            <span class="kicker">Persönlicher Bereich</span>
            <h2>${h.escapeHtml(title)}</h2>
            <p>${h.escapeHtml(subtitle)}</p>
          </div>
        </div>
        <div class="shortcut-grid shortcut-grid--personal">
          ${shortcuts.length ? shortcuts.map((shortcut) => shortcutTile(shortcut, h, { user: key })).join("") : `
            <div class="personal-empty">Noch leer. Öffne unten die App-Bibliothek und füge passende Apps hinzu.</div>
          `}
        </div>
      </section>
    `;
  }

  function areaFolder(area, data, h) {
    const tools = window.OSM_AREA_TOOLS || {};
    const metrics = tools.areaMetrics ? tools.areaMetrics(area, data).slice(0, 2) : [];
    return `
      <a class="area-folder" href="#area-${h.escapeHtml(area.id)}">
        <span class="area-folder__icon app-icon app-icon--${h.escapeHtml(hashColor(area.id))}">${h.escapeHtml(initials(area.title))}</span>
        <span class="area-folder__body">
          <strong>${h.escapeHtml(area.title)}</strong>
          <small>${h.escapeHtml(h.displayText(area.description || ""))}</small>
          <span class="area-folder__metrics">
            ${metrics.map((metric) => `<span>${h.escapeHtml(metric.label)}: <b>${h.escapeHtml(metric.value)}</b></span>`).join("")}
          </span>
        </span>
      </a>
    `;
  }

  function libraryItem(shortcut, h) {
    return `
      <article class="library-app">
        ${shortcut.action ? `
          <button class="library-app__main" type="button" data-action="workspace-shortcut" data-shortcut="${h.escapeHtml(shortcut.id)}">
            ${shortcutInner(shortcut, h)}
          </button>
        ` : `
          <a class="library-app__main" href="${h.escapeHtml(shortcut.href || "#dashboard")}">
            ${shortcutInner(shortcut, h)}
          </a>
        `}
        <p>${h.escapeHtml(h.displayText(shortcut.description || ""))}</p>
        <div class="library-app__actions">
          <button type="button" data-action="personal-add" data-user="owner" data-shortcut="${h.escapeHtml(shortcut.id)}">Zu mir</button>
          <button type="button" data-action="personal-add" data-user="mohammed" data-shortcut="${h.escapeHtml(shortcut.id)}">Zu Mohammed</button>
        </div>
      </article>
    `;
  }

  function renderFocusStrip(data, h) {
    const openRfqs = count("rfqs", data, (item) => !["abgelehnt", "gewonnen"].includes(item.status));
    const openOrders = count("orders", data, (item) => item.status !== "geliefert");
    const openTasks = count("tasks", data, (item) => item.status !== "erledigt");
    const materialNeeds = count("purchaseRequests", data, (item) => !["erhalten", "storniert"].includes(item.status));
    const items = [
      { label: "RFQs", value: openRfqs, href: "#rfqs" },
      { label: "Aufträge", value: openOrders, href: "#orders" },
      { label: "Aufgaben", value: openTasks, href: "#tasks" },
      { label: "Materialbedarf", value: materialNeeds, href: "#purchase-requests" }
    ];
    return `
      <div class="focus-strip">
        ${items.map((item) => `
          <a href="${h.escapeHtml(item.href)}">
            <strong>${h.escapeHtml(item.value)}</strong>
            <span>${h.escapeHtml(item.label)}</span>
          </a>
        `).join("")}
      </div>
    `;
  }

  function bindWorkspaceActions() {
    if (window.OSM_DASHBOARD_PERSONAL_BOUND) return;
    window.OSM_DASHBOARD_PERSONAL_BOUND = true;

    document.addEventListener("click", (event) => {
      const personalButton = event.target.closest("[data-action='personal-add'], [data-action='personal-remove']");
      if (personalButton && window.OSM && window.OSM.data) {
        event.preventDefault();
        const user = personalButton.dataset.user;
        const shortcutId = normalizeShortcutId(personalButton.dataset.shortcut || personalButton.dataset.module);
        const personal = ensurePersonal(window.OSM.data);
        personal[user] = personal[user] || [];

        if (personalButton.dataset.action === "personal-add" && !personal[user].includes(shortcutId)) {
          personal[user].push(shortcutId);
        }
        if (personalButton.dataset.action === "personal-remove") {
          personal[user] = personal[user].filter((id) => normalizeShortcutId(id) !== shortcutId);
        }

        window.OSM.state.save(window.OSM.data, { summary: "Persönlichen Workspace angepasst" });
        window.OSM.render();
        return;
      }

      const shortcutButton = event.target.closest("[data-action='workspace-shortcut']");
      if (!shortcutButton || !window.OSM || !window.OSM.data) return;
      event.preventDefault();
      const shortcut = shortcutById(shortcutButton.dataset.shortcut, window.OSM.helpers);
      if (!shortcut) return;

      if (shortcut.action === "customer-import") {
        sessionStorage.setItem("osmCustomerImportFocus", "1");
        location.hash = "#customers";
        return;
      }

      if (shortcut.action && shortcut.action.startsWith("add:") && typeof window.OSM.openForm === "function") {
        window.OSM.openForm(shortcut.action.slice(4));
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.dataset.action !== "workspace-filter") return;
      workspaceFilter = event.target.value;
      window.OSM.render();
      const input = document.querySelector("[data-action='workspace-filter']");
      if (input) input.focus();
    });
  }

  bindWorkspaceActions();

  window.OSM.registerModule({
    id: "dashboard",
    group: "Start",
    icon: "H",
    title: "Hauptseite",
    description: "App-Workspace für OS.MECHPLAST.",
    render(data, h) {
      ensurePersonal(data);
      const areas = window.OSM_AREAS || [];
      const shortcuts = allShortcuts(h).filter(shortcutMatches);
      const recommended = [
        "app:customers", "action:customer-import", "app:rfqs", "app:offer-calculator",
        "action:new-task", "app:capacity", "area:production", "area:procurement"
      ].map((id) => shortcutById(id, h)).filter(Boolean);

      return `
        <section class="launchpad">
          <div class="launchpad-head">
            <div>
              <span class="kicker">ONCC ERP</span>
              <h1>App Workspace</h1>
              <p>Die Hauptseite bleibt ruhig: persönliche Apps oben, wichtige Zahlen daneben, alle großen Bereiche als Ordner darunter.</p>
            </div>
            ${renderFocusStrip(data, h)}
          </div>

          <div class="workspace-search">
            <input data-action="workspace-filter" value="${h.escapeHtml(workspaceFilter)}" placeholder="App, Bereich oder Funktion suchen..." />
          </div>

          <div class="personal-workspaces">
            ${personalPanel("owner", "Mein Bereich", "Deine Apps, Aufgaben, Kunden und Entscheidungen.", data, h)}
            ${personalPanel("mohammed", "Mohammed", "Fertigung, Kapazität, Aufgaben und Lieferstatus.", data, h)}
          </div>

          <section class="workspace-section">
            <div class="section-head">
              <div>
                <span class="kicker">Empfohlen</span>
                <h2>Häufig gebraucht</h2>
              </div>
            </div>
            <div class="shortcut-grid">
              ${recommended.map((shortcut) => shortcutTile(shortcut, h)).join("")}
            </div>
          </section>

          <section class="workspace-section">
            <div class="section-head">
              <div>
                <span class="kicker">Bereiche</span>
                <h2>ERP als App-Ordner</h2>
              </div>
              <span class="section-note">Ein Bereich öffnet ein eigenes Dashboard mit passenden Untermenüs.</span>
            </div>
            <div class="area-folder-grid">
              ${areas.map((area) => areaFolder(area, data, h)).join("")}
            </div>
          </section>

          <details class="app-library" ${workspaceFilter ? "open" : ""}>
            <summary>
              <span>
                <span class="kicker">Anpassen</span>
                <strong>App-Bibliothek öffnen</strong>
              </span>
              <small>Apps und Funktionen zu „Mein Bereich“ oder „Mohammed“ hinzufügen</small>
            </summary>
            <div class="library-grid">
              ${shortcuts.map((shortcut) => libraryItem(shortcut, h)).join("")}
            </div>
          </details>
        </section>
      `;
    }
  });
})();
