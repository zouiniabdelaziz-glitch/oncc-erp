(function () {
  function formatDate(value) {
    if (!value) return "-";
    try {
      return new Intl.DateTimeFormat("de-DE", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  window.OSM.registerModule({
    id: "settings",
    group: "System & Rechte",
    icon: "S",
    title: "Daten & Module",
    description: "Backup, Import und Modulübersicht.",
    render(data, h) {
      const modules = window.OSM.modules.filter((module) => module.id !== "settings");
      const meta = data.meta || {};
      const sync = window.OSM.state.syncInfo ? window.OSM.state.syncInfo() : {};
      const appInfo = window.OSM_APP_VERSION || {};
      const saveHistory = (meta.saveHistory || []).slice(0, 8);
      const storageMode = sync.mode === "cloud" ? "Cloudflare D1" : "Lokaler Fallback";
      const storageText = sync.mode === "cloud"
        ? "Zentral gespeichert. Andere Benutzer sehen Änderungen nach der Synchronisation."
        : "Lokal gespeichert. Cloudflare D1 ist noch nicht verbunden oder lokal nicht erreichbar.";
      const syncStamp = sync.lastSyncAt || meta.lastCloudSyncAt || "";

      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-system">System & Rechte</a>
            </div>
            <h1 class="topbar__title">Daten & Module</h1>
            <p class="topbar__text">Lokale Daten sichern, Speicherpunkte prüfen und Modulstruktur ansehen.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-system">Zurück</a>
          </div>
        </div>

        <section class="grid grid--two">
          <div class="panel panel--pad">
            <h2>Daten</h2>
            <p class="muted">Der sichtbare Speichern-Knopf erzeugt einen Speicherpunkt, einen Historieneintrag und synchronisiert mit Cloudflare D1, sobald die Cloud-Bindung aktiv ist.</p>
            <div class="page-actions">
              <button class="button" data-action="manual-save">Jetzt speichern</button>
              <button class="button button--quiet" data-action="refresh-cloud">Cloud aktualisieren</button>
              <button class="button" data-action="export-data">Backup exportieren</button>
              <button class="button button--quiet" data-action="import-data">Backup importieren</button>
              <button class="button button--danger" data-action="reset-demo">Demo-Daten wiederherstellen</button>
              <input id="import-file" class="hidden" type="file" accept="application/json" data-action="import-file" />
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Speicherstatus</h2>
            <div class="list">
              <div class="list-item">
                <div class="list-item__title">Aktueller Modus</div>
                <div class="list-item__meta">${h.escapeHtml(storageMode)} · ${h.escapeHtml(storageText)}</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Cloud-Synchronisation</div>
                <div class="list-item__meta">${h.escapeHtml(sync.status || "lokal")} ${syncStamp ? `· ${h.escapeHtml(formatDate(syncStamp))}` : ""} ${sync.lastError ? `· ${h.escapeHtml(sync.lastError)}` : ""}</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Letzte manuelle Speicherung</div>
                <div class="list-item__meta">${h.escapeHtml(formatDate(meta.lastManualSaveAt))} ${meta.lastManualSaveBy ? `· ${h.escapeHtml(meta.lastManualSaveBy)}` : ""}</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Lokaler Speicherstand</div>
                <div class="list-item__meta">${h.escapeHtml(formatDate(meta.lastLocalSaveAt))}</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Speicher-Version</div>
                <div class="list-item__meta">Lokal ${h.escapeHtml(meta.saveVersion || 0)} ${sync.version ? `· Cloud ${h.escapeHtml(sync.version)}` : ""}</div>
              </div>
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Programm & Updates</h2>
            <p class="muted">Die Windows-App ist nur der Zugang zum ERP. Der aktuelle Programmcode wird aus Cloudflare geladen, dadurch sehen Abdelaziz und Mohammed nach einem Deployment automatisch die neue Version.</p>
            <div class="list">
              <div class="list-item">
                <div class="list-item__title">Aktuelle Version</div>
                <div class="list-item__meta">${h.escapeHtml(appInfo.version || "Cloud-Version")} ${appInfo.releaseDate ? `· ${h.escapeHtml(appInfo.releaseDate)}` : ""}</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Update-Modus</div>
                <div class="list-item__meta">${h.escapeHtml(appInfo.updateMode || "Automatisch über Cloudflare Pages")}</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Installationsart</div>
                <div class="list-item__meta">${h.escapeHtml(appInfo.installMode || "Windows Cloud-App")} · keine Neuinstallation bei normalen ERP-Updates</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Online-Adresse</div>
                <div class="list-item__meta">${h.escapeHtml(appInfo.appUrl || window.location.origin || "-")}</div>
              </div>
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Speicher-Historie</h2>
            ${saveHistory.length ? `
              <div class="list">
                ${saveHistory.map((item) => `
                  <div class="list-item">
                    <div class="list-item__title">Version ${h.escapeHtml(item.version || "-")} · ${h.escapeHtml(formatDate(item.timestamp))}</div>
                    <div class="list-item__meta">${h.escapeHtml(item.summary || "Speicherpunkt")} · ${h.escapeHtml(item.user || "-")}</div>
                  </div>
                `).join("")}
              </div>
            ` : `<p class="muted">Noch kein manueller Speicherpunkt. Oben rechts auf Speichern klicken.</p>`}
          </div>

          <div class="panel panel--pad">
            <h2>Modulprinzip</h2>
            <p class="muted">Jeder Bereich ist ein eigenes Modul. Große Bereiche werden in kleine Module geteilt, damit wir später austauschen, löschen oder erweitern können.</p>
            <div class="list">
              ${modules.map((module) => `
                <div class="list-item">
                  <div class="list-item__title">${h.escapeHtml(h.displayText(module.title))}</div>
                  <div class="list-item__meta">${h.escapeHtml(h.displayText(module.group))} &middot; ${module.collection ? "CRUD-Modul" : "Auswertung/Logik"}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    }
  });
})();
