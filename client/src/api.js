const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "trainly_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  // Projects
  getProjects: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/projects${qs ? `?${qs}` : ""}`);
  },
  getProjectCategories: () => request("/projects/categories"),
  getProject: (id) => request(`/projects/${id}`),

  // Applications
  submitApplication: (payload) =>
    request("/applications", { method: "POST", body: JSON.stringify(payload) }),
  getMyApplications: () => request("/applications/mine"),

  // Quiz
  getQuiz: () => request("/quiz"),
  submitQuiz: (payload) =>
    request("/quiz/submit", { method: "POST", body: JSON.stringify(payload) }),

  // Community
  getCommunityPosts: () => request("/community"),

  // Auth
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  loginWithGoogle: (credential) =>
    request("/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),
  getMe: () => request("/auth/me"),
  setTheme: (theme) => request("/auth/theme", { method: "PATCH", body: JSON.stringify({ theme }) }),

  // Notifications
  getNotifications: () => request("/notifications"),
  markNotificationsRead: () => request("/notifications/read-all", { method: "PATCH" }),

  // Admin
  getAdminStats: () => request("/admin/stats"),
  getAdminApplications: () => request("/admin/applications"),
  getAdminUsers: () => request("/admin/users"),
};
