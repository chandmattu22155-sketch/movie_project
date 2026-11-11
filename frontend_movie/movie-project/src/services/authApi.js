import { apiFetch, publicPost, saveTokens, clearTokens } from "./apiClient";

export function registerUser(data) { return publicPost("/users/register/", data); }

export async function loginUser(email, password) {
  const data = await publicPost("/users/login/", { email, password });
  saveTokens(data.access, data.refresh);
  return data;
}

export function logoutUser() { clearTokens(); }

export function getProfile() { return apiFetch("/users/profile/"); }

export function updateProfile(formData) {
  return apiFetch("/users/profile/update/", { method: "PATCH", body: formData });
}