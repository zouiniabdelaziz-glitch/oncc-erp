(function () {
  window.OSM.registerModule({
    id: "capacity",
    group: "Produktion / MRP",
    icon: "K",
    title: "Kapazitätsentscheidung",
    description: "Einfache regelbasierte Entscheidung: Maschine, Schichtbedarf, Partner und Risiko.",
    render(data, h) {
      const rfqs = data.rfqs || [];
      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-production">Produktion / MRP</a>
            </div>
            <h1 class="topbar__title">Kapazitätsentscheidung</h1>
            <p class="topbar__text">Erste MRP-Logik für anbieten, prüfen oder ablehnen.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-production">Zurück</a>
          </div>
        </div>
        <div class="notice">
          Diese Regeln sind bewusst einfach. Sie ersetzen keine echte Kalkulation, sondern verhindern schlechte Schnellzusagen.
        </div>
        <div class="grid">
          ${rfqs.length ? rfqs.map((rfq) => {
            const decision = h.decision(rfq);
            return `
              <article class="decision-card">
                <div class="decision-card__head">
                  <div>
                    <div class="decision-card__title">${h.escapeHtml(rfq.partName)}</div>
                    <div class="small muted">${h.escapeHtml(h.label("customers", rfq.customerId))} &middot; Menge ${h.escapeHtml(rfq.quantity)} &middot; Termin ${h.escapeHtml(rfq.dueDate || "-")}</div>
                  </div>
                  ${h.badge(decision.decision, h.toneForStatus(decision.decision))}
                </div>
                <div class="decision-grid">
                  <div class="decision-cell"><div class="decision-cell__label">Maschine</div><div class="decision-cell__value">${h.escapeHtml(decision.machineName)}</div></div>
                  <div class="decision-cell"><div class="decision-cell__label">Schichten</div><div class="decision-cell__value">${h.escapeHtml(decision.shiftNeed)}</div></div>
                  <div class="decision-cell"><div class="decision-cell__label">Partner</div><div class="decision-cell__value">${h.escapeHtml(decision.partnerNeed)}</div></div>
                  <div class="decision-cell"><div class="decision-cell__label">Risiko</div><div class="decision-cell__value">${h.badge(decision.risk, h.toneForStatus(decision.risk))}</div></div>
                </div>
                <div class="decision-grid">
                  <div class="decision-cell"><div class="decision-cell__label">Zusatzkapazitaet</div><div class="decision-cell__value">${h.escapeHtml(decision.extraCapacity)}</div></div>
                  <div class="decision-cell"><div class="decision-cell__label">Seriöse Lieferzeit</div><div class="decision-cell__value">${h.escapeHtml(decision.leadTime)}</div></div>
                  <div class="decision-cell"><div class="decision-cell__label">Teiletyp</div><div class="decision-cell__value">${h.escapeHtml(rfq.partType)}</div></div>
                  <div class="decision-cell"><div class="decision-cell__label">Toleranz</div><div class="decision-cell__value">${h.escapeHtml(rfq.tolerance)}</div></div>
                </div>
                <div class="small muted" style="margin-top: 12px;">
                  ${decision.reasons.length ? decision.reasons.map((reason) => `- ${h.escapeHtml(reason)}`).join("<br>") : "Keine besonderen Warnungen."}
                </div>
              </article>
            `;
          }).join("") : `<div class="panel panel--pad">Noch keine RFQs für eine Entscheidung vorhanden.</div>`}
        </div>
      `;
    }
  });
})();
