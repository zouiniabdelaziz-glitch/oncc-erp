(function () {
  const status = {
    state: "idle",
    message: "Noch nicht geprüft.",
    checkedAt: "",
    latest: null,
    updateAvailable: false,
    lastError: ""
  };

  function currentVersion() {
    return window.OSM_APP_VERSION || {};
  }

  function versionUrl() {
    const url = new URL("version.json", window.location.href);
    url.searchParams.set("check", Date.now().toString());
    return url.toString();
  }

  function setStatus(next) {
    Object.assign(status, next);
    window.dispatchEvent(new CustomEvent("osm-update-status", { detail: { ...status } }));
  }

  function sameVersion(latest, current) {
    return Boolean(latest && current && latest.version && current.version && latest.version === current.version);
  }

  async function check(options = {}) {
    const silent = options.silent === true;
    const current = currentVersion();
    setStatus({
      state: "checking",
      message: "Update wird geprüft...",
      lastError: ""
    });

    try {
      const response = await fetch(versionUrl(), {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });

      if (!response.ok) {
        throw new Error(`Update-Info nicht erreichbar (${response.status})`);
      }

      const latest = await response.json();
      const updateAvailable = Boolean(latest.version && current.version && !sameVersion(latest, current));
      const message = updateAvailable
        ? `Update verfügbar: ${latest.version}`
        : `Aktuell: ${current.version || latest.version || "Cloud-Version"}`;

      setStatus({
        state: updateAvailable ? "available" : "current",
        message,
        checkedAt: new Date().toISOString(),
        latest,
        updateAvailable,
        lastError: ""
      });

      if (!silent && updateAvailable && window.confirm(`${message}\n\nJetzt aktualisieren?`)) {
        apply();
      } else if (!silent && !updateAvailable) {
        window.alert("ONCC ERP ist aktuell.");
      }

      return { ...status };
    } catch (error) {
      const message = error && error.message ? error.message : "Update-Prüfung fehlgeschlagen.";
      setStatus({
        state: "error",
        message,
        checkedAt: new Date().toISOString(),
        latest: null,
        updateAvailable: false,
        lastError: message
      });
      if (!silent) window.alert(message);
      return { ...status };
    }
  }

  async function clearAppCaches() {
    if (!("caches" in window)) return;
    try {
      const names = await window.caches.keys();
      await Promise.all(names.map((name) => window.caches.delete(name)));
    } catch (error) {
      // CacheStorage is optional here; the URL refresh below is the important part.
    }
  }

  async function apply() {
    setStatus({
      state: "updating",
      message: "Neue Version wird geladen..."
    });
    await clearAppCaches();

    const url = new URL(window.location.href);
    url.searchParams.set("erp_update", Date.now().toString());
    window.location.replace(url.toString());
  }

  window.OSM_UPDATE = {
    check,
    apply,
    status: () => ({ ...status }),
    currentVersion
  };

  window.addEventListener("load", () => {
    window.setTimeout(() => check({ silent: true }), 1200);
  });
})();
