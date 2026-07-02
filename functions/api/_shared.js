export const STATE_KEY = "main";

export function jsonResponse(payload, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(payload), {
    ...init,
    headers
  });
}

export function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400"
    }
  });
}

export function userFromRequest(request, fallback = "OS.MECHPLAST") {
  return request.headers.get("cf-access-authenticated-user-email")
    || request.headers.get("x-user-email")
    || fallback;
}

export function requireDb(env) {
  if (!env || !env.ONCC_DB) {
    throw new Error("D1 binding ONCC_DB fehlt.");
  }
  return env.ONCC_DB;
}

export async function ensureSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS erp_state (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL DEFAULT 'system'
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS erp_events (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      user TEXT NOT NULL DEFAULT 'system',
      event_type TEXT NOT NULL,
      summary TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_erp_events_timestamp
    ON erp_events (timestamp DESC)
  `).run();
}

export function eventId(prefix = "evt") {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 8)}`;
}
