export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  const json = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = json?.error || json?.message || "Request failed.";
    const err = new Error(message);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json;
}

