"use client";

const KEY = "zaruret:admin:token";
const USER_KEY = "zaruret:admin:user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setToken(token: string, user?: string) {
  localStorage.setItem(KEY, token);
  if (user) localStorage.setItem(USER_KEY, user);
}

export function getUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function clearAuth() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_KEY);
}
