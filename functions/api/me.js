import { jsonResponse, optionsResponse } from "./_shared.js";

function decodeJwtPayload(token) {
  if (!token || !token.includes(".")) return {};
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch (error) {
    return {};
  }
}

function headerValue(request, name) {
  return request.headers.get(name) || request.headers.get(name.toLowerCase()) || "";
}

function identityFromRequest(request) {
  const email =
    headerValue(request, "cf-access-authenticated-user-email") ||
    headerValue(request, "x-user-email") ||
    "";

  const jwtPayload = decodeJwtPayload(headerValue(request, "cf-access-jwt-assertion"));
  const jwtEmail = jwtPayload.email || jwtPayload.common_name || "";

  return {
    email: email || jwtEmail || "",
    name: jwtPayload.name || jwtPayload.given_name || "",
    source: email ? "cloudflare-access-header" : jwtEmail ? "cloudflare-access-jwt" : "none"
  };
}

export async function onRequestOptions() {
  return optionsResponse();
}

export async function onRequestGet({ request }) {
  const identity = identityFromRequest(request);
  return jsonResponse({
    ok: true,
    authenticated: !!identity.email,
    identity
  });
}

