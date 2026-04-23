export function getStoredUser() {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setAuthSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("authChanged"));
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("authChanged"));
}

export function isAdminUser(user) {
  return Boolean(user && user.role === "admin");
}
