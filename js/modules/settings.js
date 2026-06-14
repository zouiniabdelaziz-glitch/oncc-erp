(function () {
  window.OSM.registerModule({
    id: "settings",
    group: "System",
    icon: "S",
    title: "Daten & Module",
    description: "Backup, Import und Moduluebersicht.",
    render(data) {
      const modules = window.OSM.modules.filter((module) => module.id !== "settings");
      return `
        <div class="topbar">
          <div>
            <h1 class="topbar__title">Daten & Module</h1>
            <p class="topbar__text">Lokale Daten sichern, importieren und Modulstruktur pruefen.</p>
          </div>
        </div>
        <section class="grid grid--two">
          <div class="panel panel--pad">
            <h2>Daten</h2>
            <p class="muted">Die App speichert aktuell lokal im Browser. Fuer die spaetere .exe wird daraus SQLite im App-Datenordner.</p>
            <div class="page-actions">
              <button class="button" data-action="export-data">Backup exportieren</button>
              <button class="button button--quiet" data-action="import-data">Backup importieren</button>
              <button class="button button--danger" data-action="reset-demo">Demo-Daten wiederherstellen</button>
              <input id="import-file" class="hidden" type="file" accept="application/json" data-action="import-file" />
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Modulprinzip</h2>
            <p class="muted">Jeder Bereich ist ein eigenes Modul. Grosse Bereiche werden in kleine Module geteilt, damit wir spaeter austauschen, loeschen oder erweitern koennen.</p>
            <div class="list">
              ${modules.map((module) => `
                <div class="list-item">
                  <div class="list-item__title">${module.title}</div>
                  <div class="list-item__meta">${module.group} &middot; ${module.collection ? "CRUD-Modul" : "Auswertung/Logik"}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    }
  });
})();
