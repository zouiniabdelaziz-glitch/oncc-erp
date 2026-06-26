(function () {
  window.OSM.registerModule({
    id: "settings",
    group: "System & Rechte",
    icon: "S",
    title: "Daten & Module",
    description: "Backup, Import und Modulübersicht.",
    render(data) {
      const modules = window.OSM.modules.filter((module) => module.id !== "settings");
      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-system">System & Rechte</a>
            </div>
            <h1 class="topbar__title">Daten & Module</h1>
            <p class="topbar__text">Lokale Daten sichern, importieren und Modulstruktur prüfen.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-system">Zurück</a>
          </div>
        </div>
        <section class="grid grid--two">
          <div class="panel panel--pad">
            <h2>Daten</h2>
            <p class="muted">Die App speichert aktuell lokal im Browser. Für die spätere .exe wird daraus SQLite im App-Datenordner.</p>
            <div class="page-actions">
              <button class="button" data-action="export-data">Backup exportieren</button>
              <button class="button button--quiet" data-action="import-data">Backup importieren</button>
              <button class="button button--danger" data-action="reset-demo">Demo-Daten wiederherstellen</button>
              <input id="import-file" class="hidden" type="file" accept="application/json" data-action="import-file" />
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Modulprinzip</h2>
            <p class="muted">Jeder Bereich ist ein eigenes Modul. Große Bereiche werden in kleine Module geteilt, damit wir später austauschen, löschen oder erweitern koennen.</p>
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
