import { ensureSchema, jsonResponse, optionsResponse, requireDb } from "./_shared.js";

export async function onRequestOptions() {
  return optionsResponse();
}

export async function onRequestGet({ env }) {
  try {
    const db = requireDb(env);
    await ensureSchema(db);
    return jsonResponse({
      ok: true,
      storage: "cloudflare-d1",
      binding: "ONCC_DB"
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      storage: "local-fallback",
      error: error.message
    }, { status: 503 });
  }
}
