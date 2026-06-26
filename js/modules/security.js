(function () {
  window.OSM.registerModule({
    id: "security",
    group: "System & Rechte",
    icon: "S",
    title: "Sicherheit",
    description: "Intranet-Zugriff, Rollen, Backups und spaetere Cloudflare-Absicherung.",
    render(data, h) {
      const roleCount = (data.roles || []).length;
      const auditCount = (data.auditLogs || []).length;
      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-system">System & Rechte</a>
            </div>
            <h1 class="topbar__title">Sicherheit</h1>
            <p class="topbar__text">Sicherheitsuebersicht fuer lokalen Intranet-Betrieb und spaetere Cloudflare-Absicherung.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-system">Zurueck</a>
          </div>
        </div>

        <section class="grid grid--stats">
          <div class="stat"><div class="stat__label">Rollen angelegt</div><div class="stat__value">${roleCount}</div></div>
          <div class="stat"><div class="stat__label">Historie</div><div class="stat__value">${auditCount}</div></div>
          <div class="stat"><div class="stat__label">Modus</div><div class="stat__value">Intranet</div></div>
          <div class="stat"><div class="stat__label">Cloudflare</div><div class="stat__value">Spaeter</div></div>
        </section>

        <section class="grid grid--two">
          <div class="panel panel--pad">
            <h2>Jetzt aktiv</h2>
            <div class="list">
              <div class="list-item">
                <div class="list-item__title">Lokale Intranet-Seite</div>
                <div class="list-item__meta">Aktuell ueber lokalen Server erreichbar, ohne Internet-Zwang.</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Rollenmodell vorbereitet</div>
                <div class="list-item__meta">Bereiche und Rollen sind als Daten vorhanden, echte Anmeldung folgt mit Datenbank/Client.</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Audit-Historie</div>
                <div class="list-item__meta">Speichern und Loeschen erzeugt Historieneintraege.</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Backup</div>
                <div class="list-item__meta">JSON-Export und Import im Modul Daten & Module.</div>
              </div>
            </div>
          </div>

          <div class="panel panel--pad">
            <h2>Spaeter absichern</h2>
            <div class="list">
              <div class="list-item">
                <div class="list-item__title">Cloudflare Access</div>
                <div class="list-item__meta">ERP nur fuer erlaubte Benutzer, optional mit 2FA und Geraeteregeln.</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Echte Anmeldung</div>
                <div class="list-item__meta">Passwort nicht im Browser-Code speichern. Login erst mit Backend/SQLite-Client oder Cloudflare Access.</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Desktop-App</div>
                <div class="list-item__meta">Tauri + SQLite, lokale Dateien, Benutzerrechte und sichere Sicherung.</div>
              </div>
              <div class="list-item">
                <div class="list-item__title">Keine Schein-Sicherheit</div>
                <div class="list-item__meta">Ein simples JavaScript-Passwort waere leicht umgehbar und wird deshalb nicht als echte Sicherheit verkauft.</div>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  });
})();
