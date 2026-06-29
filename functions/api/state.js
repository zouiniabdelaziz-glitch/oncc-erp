import {
  STATE_KEY,
  ensureSchema,
  eventId,
  jsonResponse,
  optionsResponse,
  requireDb,
  userFromRequest
} from "./_shared.js";

export async function onRequestOptions() {
  return optionsResponse();
}

export async function onRequestGet({ env }) {
  try {
    const db = requireDb(env);
    await ensureSchema(db);
    const row = await db.prepare(
      "SELECT data, version, updated_at, updated_by FROM erp_state WHERE key = ?"
    ).bind(STATE_KEY).first();

    if (!row) {
      return jsonResponse({
        ok: true,
        found: false,
        data: null,
        version: 0,
        updatedAt: null,
        updatedBy: null
      });
    }

    return jsonResponse({
      ok: true,
      found: true,
      data: JSON.parse(row.data),
      version: row.version,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const db = requireDb(env);
    await ensureSchema(db);
    const payload = await request.json();
    const data = payload && payload.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return jsonResponse({
        ok: false,
        error: "Keine gültigen ERP-Daten empfangen."
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const user = userFromRequest(request, payload.user || "OS.MECHPLAST");
    const existing = await db.prepare(
      "SELECT version FROM erp_state WHERE key = ?"
    ).bind(STATE_KEY).first();
    const version = Number(existing && existing.version ? existing.version : 0) + 1;
    const dataText = JSON.stringify(data);

    await db.batch([
      db.prepare(`
        INSERT INTO erp_state (key, data, version, updated_at, updated_by)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          data = excluded.data,
          version = excluded.version,
          updated_at = excluded.updated_at,
          updated_by = excluded.updated_by
      `).bind(STATE_KEY, dataText, version, now, user),
      db.prepare(`
        INSERT INTO erp_events (id, timestamp, user, event_type, summary, version)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        eventId("sync"),
        now,
        user,
        payload.eventType || "state_saved",
        payload.summary || "ERP-Daten gespeichert",
        version
      )
    ]);

    return jsonResponse({
      ok: true,
      version,
      updatedAt: now,
      updatedBy: user
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message
    }, { status: 500 });
  }
}
