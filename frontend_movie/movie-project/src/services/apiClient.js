const API_URL = import.meta.env.VITE_API_URL;

export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export function saveTokens(access, refresh) {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

async function readJson(response) {
  try { return await response.json(); } catch { return {}; }
}

function getErrorMessage(data, fallback) {
  if (!data || typeof data !== "object") return fallback;
  if (data.detail) return data.detail;
  const lines = Object.entries(data).map(([field, value]) => {
    const text = Array.isArray(value) ? value.join(" ") : String(value);
    return field === "non_field_errors" ? text : `${field}: ${text}`;
  });
  return lines.length ? lines.join("\n") : fallback;
}

export async function publicPost(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(getErrorMessage(data, "Request failed"));
  return data;
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");
  const data = await publicPost("/users/token/refresh/", { refresh });
  saveTokens(data.access, data.refresh);
  return data.access;
}

export async function apiFetch(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const send = (token) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let response = await send(getAccessToken());

  if (response.status === 401 && getRefreshToken()) {
    try {
      const newToken = await refreshAccessToken();
      response = await send(newToken);
    } catch {
      clearTokens();
      window.location.href = "/login";
      throw new Error("Session expired.");
    }
  }

  const data = await readJson(response);
  if (!response.ok) throw new Error(getErrorMessage(data, "Request failed"));
  return data;
}